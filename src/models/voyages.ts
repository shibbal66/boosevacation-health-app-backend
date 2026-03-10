import cuid from "common/cuid";
import { pgTable, text, date, index } from "drizzle-orm/pg-core";
import usersTable from "models/users";

const voyagesTable = pgTable(
  "voyages",
  {
    id: cuid().primaryKey(),
    userId: text()
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    startDate: date().notNull(),
    endDate: date().notNull()
  },
  (table) => [index().on(table.userId)]
);

export default voyagesTable;
export type Voyage = typeof voyagesTable.$inferSelect;
