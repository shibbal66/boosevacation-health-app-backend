import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression } from "@nestjs/schedule";
import { and, eq, isNotNull, lt } from "drizzle-orm";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging, type Messaging } from "firebase-admin/messaging";
import sessionsTable from "models/sessions";
import usersTable from "models/users";
import verificationsTable from "models/verifications";
import { DatabaseService } from "modules/database/database.service";

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);
  private messaging: Messaging;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService
  ) {}

  onModuleInit() {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: this.configService.get<string>("FIREBASE_PROJECT_ID"),
          clientEmail: this.configService.get<string>("FIREBASE_CLIENT_EMAIL"),
          privateKey: this.configService.get<string>("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n")
        })
      });

      this.logger.log("Firebase Admin initialized");
      this.messaging = getMessaging();
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendScheduledNotifications() {
    try {
      const users = await this.databaseService.db
        .select()
        .from(usersTable)
        .where(
          and(eq(usersTable.notificationEnabled, true), isNotNull(usersTable.fcmToken), isNotNull(usersTable.timezone))
        );

      for (const user of users) {
        const tz = user.timezone!;
        const now = new Date();

        let localHH: number, localMM: number;
        try {
          const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }).formatToParts(now);

          localHH = parseInt(parts.find((p) => p.type === "hour")!.value, 10);
          localMM = parseInt(parts.find((p) => p.type === "minute")!.value, 10);
        } catch {
          this.logger.warn(`Invalid timezone for user ${user.id}: ${tz}`);
          continue;
        }

        const currentTime = `${String(localHH).padStart(2, "0")}:${String(localMM).padStart(2, "0")}`;

        let notificationType: "morning" | "evening" | null = null;
        if (user.morningNotificationTime && user.morningNotificationTime.slice(0, 5) === currentTime) {
          notificationType = "morning";
        } else if (user.eveningNotificationTime && user.eveningNotificationTime.slice(0, 5) === currentTime) {
          notificationType = "evening";
        }

        if (!notificationType) {
          continue;
        }

        const message =
          notificationType === "morning"
            ? { title: "Good Morning!", body: "Start your day with a healthy boost!" }
            : { title: "Good Evening!", body: "Time to wind down and reflect on your day!" };

        try {
          await this.messaging.send({
            token: user.fcmToken!,
            notification: message
          });

          this.logger.log(`Sent ${notificationType} notification to user ${user.id}`);
        } catch (error) {
          this.logger.error(`Failed to send notification to user ${user.id}: ${error}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error in sendScheduledNotifications: ${error}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cleanExpiredData() {
    await this.cleanExpiredSessions();
    await this.cleanExpiredVerifications();
  }

  private async cleanExpiredSessions() {
    try {
      const now = new Date();
      const result = await this.databaseService.db.delete(sessionsTable).where(lt(sessionsTable.expiryTime, now));

      this.logger.log(`Cleaned ${result.rowCount} expired sessions at ${now.toISOString()}`);
      return result;
    } catch (error) {
      this.logger.error(`Error cleaning expired sessions: ${error}`);
      throw error;
    }
  }

  private async cleanExpiredVerifications() {
    try {
      const now = new Date();
      const result = await this.databaseService.db
        .delete(verificationsTable)
        .where(lt(verificationsTable.expiresAt, now));

      this.logger.log(`Cleaned ${result.rowCount} expired verifications at ${now.toISOString()}`);
      return result;
    } catch (error) {
      this.logger.error(`Error cleaning expired verifications: ${error}`);
      throw error;
    }
  }
}
