import cuid from "common/cuid";
import { pgTable, text, date, time, integer, jsonb, index, unique } from "drizzle-orm/pg-core";
import usersTable from "models/users";

const dayLogTable = pgTable(
  "day_logs",
  {
    id: cuid().primaryKey(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    date: date().notNull(),
    feeling: integer(),
    bedtime: time(),
    wakeTime: time(),
    sleepQuality: integer(),
    logs: jsonb().$type<{
      noScreen: boolean;
      warmDrink: boolean;
      gratitude: boolean;
      roomTemperatureSet: boolean;
      meditation: boolean;
      morningSunlight: boolean;
      coldShower: boolean;
      hydrate: boolean;
      noCaffeine: boolean;
      exercise: boolean;
    }>()
  },
  (table) => [index().on(table.userId), index().on(table.date), unique().on(table.userId, table.date)]
);

export default dayLogTable;
export type DayLog = typeof dayLogTable.$inferSelect;
