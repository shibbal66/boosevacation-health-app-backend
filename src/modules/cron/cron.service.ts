import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { and, eq, isNotNull, lte } from "drizzle-orm";
import daysTable from "models/days";
import usersTable from "models/users";
import voyagesTable from "models/voyages";
import { DatabaseService } from "modules/database/database.service";
import { NotificationService } from "modules/notification/notification.service";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationService: NotificationService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async addDailyVoyageDays() {
    const users = await this.databaseService.db
      .select({
        id: usersTable.id,
        timezone: usersTable.timezone
      })
      .from(usersTable);

    const now = new Date();

    for (const user of users) {
      try {
        const timezone = user.timezone ?? "UTC";

        const localTime = now.toLocaleTimeString("en-GB", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });

        if (localTime !== "00:00") {
          continue;
        }

        const localDateStr = now.toLocaleDateString("en-CA", { timeZone: timezone });

        const [voyage] = await this.databaseService.db
          .select({ id: voyagesTable.id })
          .from(voyagesTable)
          .where(and(eq(voyagesTable.userId, user.id), lte(voyagesTable.startDate, localDateStr)))
          .limit(1);

        if (!voyage) {
          continue;
        }

        const [existingDay] = await this.databaseService.db
          .select({ id: daysTable.id })
          .from(daysTable)
          .where(and(eq(daysTable.voyageId, voyage.id), eq(daysTable.date, localDateStr)))
          .limit(1);

        if (existingDay) {
          continue;
        }

        await this.databaseService.db.insert(daysTable).values({
          voyageId: voyage.id,
          date: localDateStr
        });

        this.logger.log(`Added day ${localDateStr} for user ${user.id}`);
      } catch (err) {
        this.logger.error(`Failed to add day for user ${user.id}`, err);
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendDailyReminders() {
    const users = await this.databaseService.db
      .select({
        id: usersTable.id,
        notificationTime: usersTable.notificationTime,
        timezone: usersTable.timezone
      })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.notificationEnabled, true),
          isNotNull(usersTable.fcmToken),
          isNotNull(usersTable.notificationTime)
        )
      );

    for (const user of users) {
      try {
        const timezone = user.timezone ?? "UTC";
        const now = new Date();

        const localTime = now.toLocaleTimeString("en-GB", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });

        const notificationTime = user.notificationTime!.slice(0, 5);

        if (localTime !== notificationTime) {
          continue;
        }

        const localDateStr = now.toLocaleDateString("en-CA", { timeZone: timezone });

        const [day] = await this.databaseService.db
          .select({ completed: daysTable.completed })
          .from(daysTable)
          .innerJoin(voyagesTable, eq(daysTable.voyageId, voyagesTable.id))
          .where(
            and(
              eq(voyagesTable.userId, user.id),
              eq(daysTable.date, localDateStr),
              lte(voyagesTable.startDate, localDateStr)
            )
          )
          .limit(1);

        if (day && !day.completed) {
          await this.notificationService.sendToUser(
            user.id,
            "Daily Check-in Reminder",
            "Don't forget to log your day before it ends!"
          );
        }
      } catch (err) {
        this.logger.error(`Failed to process notification for user ${user.id}`, err);
      }
    }
  }
}
