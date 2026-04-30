import cuid from "common/cuid";
import { pgTable, text, integer } from "drizzle-orm/pg-core";

const quotesTable = pgTable("quotes", {
  id: cuid().primaryKey(),
  day: integer().notNull(),
  quote: text().notNull()
});

export default quotesTable;
export type Quote = typeof quotesTable.$inferSelect;
