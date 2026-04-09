import cuid from "common/cuid";
import { pgTable, text } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
  id: cuid().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  timezone: text(),
  fcmToken: text()
});

export default usersTable;
export type User = typeof usersTable.$inferSelect;
export type SafeUser = Omit<User, "password">;
