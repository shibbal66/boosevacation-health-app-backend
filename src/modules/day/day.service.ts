import { Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import dayLogTable from "models/dayLog";
import usersTable from "models/users";
import { DatabaseService } from "modules/database/database.service";
import { CreateDayLogDto } from "modules/day/day.dto";

@Injectable()
export class DayService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllDayLogs(userId: string) {
    const results = await this.databaseService.db
      .select()
      .from(dayLogTable)
      .where(eq(dayLogTable.userId, userId))
      .orderBy(desc(dayLogTable.date));

    return { data: results };
  }

  async addDayLog(userId: string, data: CreateDayLogDto) {
    const [user] = await this.databaseService.db
      .select({ timezone: usersTable.timezone })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    const timezone = user?.timezone ?? "UTC";

    const localDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());

    const [result] = await this.databaseService.db
      .insert(dayLogTable)
      .values({
        userId,
        date: localDate,
        feeling: data.feeling,
        bedtime: data.bedtime,
        wakeTime: data.wakeTime,
        sleepQuality: data.sleepQuality,
        logs: data.logs
      })
      .onConflictDoUpdate({
        target: [dayLogTable.userId, dayLogTable.date],
        set: {
          feeling: data.feeling,
          bedtime: data.bedtime,
          wakeTime: data.wakeTime,
          sleepQuality: data.sleepQuality,
          logs: data.logs
        }
      })
      .returning();

    return { data: result };
  }
}
