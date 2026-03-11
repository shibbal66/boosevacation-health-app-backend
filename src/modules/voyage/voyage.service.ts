import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
import { and, asc, eq, lte, gte } from "drizzle-orm";
import daysTable, { Mood, type Day } from "models/days";
import usersTable from "models/users";
import voyagesTable, { type Voyage } from "models/voyages";
import { DatabaseService } from "modules/database/database.service";
import { LogDayDto } from "modules/voyage/voyage.dto";

export type VoyageWithDays = Voyage & { days: Day[] };

export type VoyageAnalytics = {
  streak: number;
  checkedIn: number;
  alcoholFree: number;
  averageMood: number;
};

@Injectable()
export class VoyageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllVoyages(userId: string, date?: string): Promise<VoyageWithDays[]> {
    const voyages = date
      ? await this.databaseService.db
          .select()
          .from(voyagesTable)
          .where(
            and(eq(voyagesTable.userId, userId), lte(voyagesTable.startDate, date), gte(voyagesTable.endDate, date))
          )
          .limit(1)
      : await this.databaseService.db.select().from(voyagesTable).where(eq(voyagesTable.userId, userId));

    if (voyages.length === 0) {
      return [];
    }

    const voyageIds = voyages.map((v) => v.id);
    const days = await Promise.all(
      voyageIds.map((id) => this.databaseService.db.select().from(daysTable).where(eq(daysTable.voyageId, id)))
    );

    return voyages.map((voyage, i) => ({ ...voyage, days: days[i] }));
  }

  async getVoyageById(userId: string, voyageId: string): Promise<VoyageWithDays> {
    const [voyage] = await this.databaseService.db
      .select()
      .from(voyagesTable)
      .where(and(eq(voyagesTable.id, voyageId), eq(voyagesTable.userId, userId)))
      .limit(1);

    if (!voyage) {
      throw new NotFoundException("Voyage not found");
    }

    const days = await this.databaseService.db.select().from(daysTable).where(eq(daysTable.voyageId, voyageId));

    return { ...voyage, days };
  }

  async getDay(userId: string, date: string): Promise<{ voyage: Voyage; day: Day }> {
    const [voyage] = await this.databaseService.db
      .select()
      .from(voyagesTable)
      .where(and(eq(voyagesTable.userId, userId), lte(voyagesTable.startDate, date), gte(voyagesTable.endDate, date)))
      .limit(1);

    if (!voyage) {
      throw new NotFoundException("No voyage found for the given date");
    }

    const [day] = await this.databaseService.db
      .select()
      .from(daysTable)
      .where(and(eq(daysTable.voyageId, voyage.id), eq(daysTable.date, date)))
      .limit(1);

    if (!day) {
      throw new NotFoundException("No day entry found for the given date");
    }

    return { voyage, day };
  }

  async logDay(userId: string, dto: LogDayDto): Promise<Day> {
    const [user] = await this.databaseService.db
      .select({ timezone: usersTable.timezone })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    const today = this.getCurrentDateInTimezone(user?.timezone ?? "UTC");

    const [voyage] = await this.databaseService.db
      .select()
      .from(voyagesTable)
      .where(and(eq(voyagesTable.userId, userId), lte(voyagesTable.startDate, today), gte(voyagesTable.endDate, today)))
      .limit(1);

    if (!voyage) {
      throw new NotFoundException("No active voyage found for today");
    }

    const [day] = await this.databaseService.db
      .select()
      .from(daysTable)
      .where(and(eq(daysTable.voyageId, voyage.id), eq(daysTable.date, today)))
      .limit(1);

    if (!day) {
      throw new NotFoundException("No day entry found for today");
    }

    if (day.completed) {
      throw new BadRequestException("Day is already completed and cannot be updated");
    }

    const [updated] = await this.databaseService.db
      .update(daysTable)
      .set({ ...dto, completed: true })
      .where(eq(daysTable.id, day.id))
      .returning();

    return updated;
  }

  async getAnalytics(userId: string): Promise<VoyageAnalytics> {
    const [user] = await this.databaseService.db
      .select({ timezone: usersTable.timezone })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    const today = this.getCurrentDateInTimezone(user?.timezone ?? "UTC");

    const [voyage] = await this.databaseService.db
      .select()
      .from(voyagesTable)
      .where(and(eq(voyagesTable.userId, userId), lte(voyagesTable.startDate, today), gte(voyagesTable.endDate, today)))
      .limit(1);

    if (!voyage) {
      throw new NotFoundException("No active voyage found for today");
    }

    const days = await this.databaseService.db
      .select()
      .from(daysTable)
      .where(and(eq(daysTable.voyageId, voyage.id), lte(daysTable.date, today)))
      .orderBy(asc(daysTable.date));

    const moodScore: Record<Mood, number> = {
      [Mood.TERRIBLE]: 1,
      [Mood.BAD]: 2,
      [Mood.OK]: 3,
      [Mood.GOOD]: 4,
      [Mood.GREAT]: 5
    };

    let streak = 0;
    for (const day of days) {
      if (day.completed) {
        streak++;
      } else {
        break;
      }
    }

    const checkedIn = days.filter((d) => d.completed).length;

    const alcoholFree = Math.round((days.filter((d) => !d.alcohol && d.completed).length / checkedIn) * 100);

    const completedWithMood = days.filter((d) => d.completed && d.mood);
    const moodSum = completedWithMood.reduce((sum, d) => sum + moodScore[d.mood!], 0);
    const averageMood = checkedIn > 0 ? moodSum / checkedIn : 0;

    return { streak, checkedIn, alcoholFree, averageMood };
  }

  private getCurrentDateInTimezone(timezone: string): string {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());
  }

  private toDateString(date: Date): string {
    return date.toISOString().split("T")[0];
  }
}
