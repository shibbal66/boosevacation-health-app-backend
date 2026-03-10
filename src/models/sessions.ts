import cuid from "common/cuid";
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import usersTable from "models/users";

const sessionsTable = pgTable(
  "sessions",
  {
    id: cuid().primaryKey(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    refreshTokenHash: text().notNull(),
    ipAddress: text().notNull(),
    expiryTime: timestamp({ withTimezone: true, mode: "date" }).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "date" }).defaultNow().notNull()
  },
  (table) => [index().on(table.userId), index().on(table.refreshTokenHash), index().on(table.expiryTime)]
);

export default sessionsTable;
export type Session = typeof sessionsTable.$inferSelect;
