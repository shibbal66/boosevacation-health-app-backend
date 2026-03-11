import cuid from "common/cuid";
import { pgTable, text, date, boolean, pgEnum, index } from "drizzle-orm/pg-core";
import voyagesTable from "models/voyages";

export enum Mood {
  TERRIBLE = "TERRIBLE",
  BAD = "BAD",
  OK = "OK",
  GOOD = "GOOD",
  GREAT = "GREAT"
}

export const moodEnum = pgEnum("mood", [Mood.TERRIBLE, Mood.BAD, Mood.OK, Mood.GOOD, Mood.GREAT]);

const daysTable = pgTable(
  "days",
  {
    id: cuid().primaryKey(),
    voyageId: text()
      .references(() => voyagesTable.id, { onDelete: "cascade" })
      .notNull(),
    date: date().notNull(),
    alcohol: boolean().notNull().default(false),
    caffeine: boolean().notNull().default(false),
    food: boolean().notNull().default(false),
    mood: moodEnum(),
    completed: boolean().notNull().default(false)
  },
  (table) => [index().on(table.voyageId)]
);

export default daysTable;
export type Day = typeof daysTable.$inferSelect;
