import { Injectable } from "@nestjs/common";
import { differenceInDays } from "date-fns";
import { desc, eq, and, sql, or, isNotNull } from "drizzle-orm";
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

  async getSleepDurations(userId: string) {
    // Fetch all logs that have either a bedtime or wakeTime for this user
    const logs = await this.databaseService.db
      .select({ date: dayLogTable.date, bedtime: dayLogTable.bedtime, wakeTime: dayLogTable.wakeTime })
      .from(dayLogTable)
      .where(and(eq(dayLogTable.userId, userId), or(isNotNull(dayLogTable.bedtime), isNotNull(dayLogTable.wakeTime))))
      .orderBy(dayLogTable.date);

    const totalDays = logs.length;

    // Build a map keyed by date string for quick lookup
    const byDate = new Map<string, { bedtime: string | null; wakeTime: string | null }>();
    for (const log of logs) {
      byDate.set(log.date, { bedtime: log.bedtime, wakeTime: log.wakeTime });
    }

    const results: { date: string; hours: string; minutes: number }[] = [];

    for (const log of logs) {
      // We only care about days that have a wakeTime — sleep started the night before
      if (!log.wakeTime) {
        continue;
      }

      // Find the previous day's bedtime
      const prevDate = new Date(log.date);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = prevDate.toISOString().split("T")[0];
      const prevLog = byDate.get(prevDateStr);

      if (!prevLog?.bedtime) {
        continue;
      }

      // Parse HH:MM times and compute duration in minutes
      const [bedHour, bedMin] = prevLog.bedtime.split(":").map(Number);
      const [wakeHour, wakeMin] = log.wakeTime.split(":").map(Number);

      let sleepMinutes = wakeHour * 60 + wakeMin - (bedHour * 60 + bedMin);
      // If wake time appears earlier than bedtime it crossed midnight — add 24h
      if (sleepMinutes <= 0) {
        sleepMinutes += 24 * 60;
      }

      const hours = Math.floor(sleepMinutes / 60);
      const mins = sleepMinutes % 60;
      const hoursStr = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;

      results.push({ date: log.date, hours: hoursStr, minutes: sleepMinutes });
    }

    let averageSleep: number | null = null;
    if (totalDays > 0 && results.length > 0) {
      const totalMinutes = results.reduce((sum, r) => sum + r.minutes, 0);
      averageSleep = Math.round((totalMinutes / totalDays / 60) * 10) / 10;
    }

    return { data: { averageSleep, sleepTimings: results } };
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
