import { Injectable } from "@nestjs/common";
import { differenceInDays } from "date-fns";
import { desc, eq, and, sql } from "drizzle-orm";
import dayLogTable from "models/dayLog";
import usersTable from "models/users";
import { DatabaseService } from "modules/database/database.service";
import { CreateDayLogDto, GetDayLogsQueryDto } from "modules/day/day.dto";

@Injectable()
export class DayService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllDayLogs(userId: string, query: GetDayLogsQueryDto) {
    const conditions = [eq(dayLogTable.userId, userId)];

    if (query.type) {
      conditions.push(eq(dayLogTable.type, query.type));
    }

    const results = await this.databaseService.db
      .select()
      .from(dayLogTable)
      .where(and(...conditions))
      .orderBy(desc(dayLogTable.date));

    return { data: results };
  }

  async addDayLog(userId: string, data: CreateDayLogDto) {
    const [result] = await this.databaseService.db
      .insert(dayLogTable)
      .values({
        userId,
        date: data.date,
        type: data.type,
        feeling: data.feeling,
        bedtime: data.bedtime,
        wakeTime: data.wakeTime,
        sleepQuality: data.sleepQuality,
        logs: data.logs
      })
      .onConflictDoUpdate({
        target: [dayLogTable.userId, dayLogTable.date],
        set: {
          type: data.type,
          ...(data.feeling !== undefined && { feeling: data.feeling }),
          ...(data.bedtime !== undefined && { bedtime: data.bedtime }),
          ...(data.wakeTime !== undefined && { wakeTime: data.wakeTime }),
          ...(data.sleepQuality !== undefined && { sleepQuality: data.sleepQuality }),
          ...(data.logs !== undefined && {
            logs:
              data.logs === null
                ? null
                : sql`COALESCE(${dayLogTable.logs}, '{}'::jsonb) || ${JSON.stringify(data.logs)}::jsonb`
          })
        }
      })
      .returning();

    return { data: result };
  }

  async getTodaysDay(userId: string) {
    const [user] = await this.databaseService.db
      .select({ programPhase: usersTable.programPhase, programStartDate: usersTable.programStartDate })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      throw new Error("User not found");
    }

    const today = new Date();
    let day = differenceInDays(today, user.programStartDate) + 1;

    if (user.programPhase === "TUTORIAL") {
      day = Math.max(1, Math.min(day, 10));
      return { data: { tutorialDay: day } };
    } else {
      day = Math.max(1, Math.min(day, 90));
      return { data: { voyageDay: day } };
    }
  }
}
