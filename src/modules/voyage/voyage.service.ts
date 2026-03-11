import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
import { and, eq, lte, gte } from "drizzle-orm";
import daysTable, { type Day } from "models/days";
import usersTable from "models/users";
import voyagesTable, { type Voyage } from "models/voyages";
import { DatabaseService } from "modules/database/database.service";
import { LogDayDto } from "modules/voyage/voyage.dto";

export type VoyageWithDays = Voyage & { days: Day[] };

@Injectable()
export class VoyageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createVoyage(userId: string): Promise<VoyageWithDays> {
    const today = new Date();
    const startDate = this.toDateString(today);
    const endDate = this.toDateString(new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000));

    const [activeVoyage] = await this.databaseService.db
      .select()
      .from(voyagesTable)
      .where(
        and(
          eq(voyagesTable.userId, userId),
          lte(voyagesTable.startDate, startDate),
          gte(voyagesTable.endDate, startDate)
        )
      )
      .limit(1);

    if (activeVoyage) {
      throw new ConflictException("An active voyage already exists");
    }

    const [voyage] = await this.databaseService.db
      .insert(voyagesTable)
      .values({ userId, startDate, endDate })
      .returning();

    interface DayValue {
      voyageId: string;
      date: string;
    }

    const dayValues: DayValue[] = [];
    for (let i = 0; i < 7; i++) {
      dayValues.push({
        voyageId: voyage.id,
        date: this.toDateString(new Date(today.getTime() + i * 24 * 60 * 60 * 1000))
      });
    }

    const days = await this.databaseService.db.insert(daysTable).values(dayValues).returning();

    return { ...voyage, days };
  }

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
