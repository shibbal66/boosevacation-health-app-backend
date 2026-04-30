import cuid from "common/cuid";
import { pgTable, text, date, time, integer, jsonb, index, unique, pgEnum } from "drizzle-orm/pg-core";
import usersTable from "models/users";

export const dayLogTypeEnum = pgEnum("day_log_type", ["TUTORIAL", "VOYAGE"]);
export type DayLogType = (typeof dayLogTypeEnum.enumValues)[number];

const dayLogTable = pgTable(
  "day_logs",
  {
    id: cuid().primaryKey(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    date: date().notNull(),
    type: dayLogTypeEnum().default("TUTORIAL").notNull(),
    feeling: integer(),
    bedtime: time(),
    wakeTime: time(),
    sleepQuality: integer(),
    logs: jsonb().$type<{
      noScreen?: boolean;
      warmDrink?: boolean;
      gratitude?: boolean;
      roomTemperatureSet?: boolean;
      meditation?: boolean;
      morningSunlight?: boolean;
      coldShower?: boolean;
      hydrate?: boolean;
      noCaffeine?: boolean;
      exercise?: boolean;
      stretching?: boolean;
      waterBeforeCoffee?: boolean;
      alcoholDesire?: number;
    }>()
  },
  (table) => [index().on(table.userId), index().on(table.date), unique().on(table.userId, table.date)]
);

export default dayLogTable;
export type DayLog = typeof dayLogTable.$inferSelect;
