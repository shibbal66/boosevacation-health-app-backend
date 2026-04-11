import cuid from "common/cuid";
import { pgTable, text, pgEnum } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", ["VERIFIED", "UNVERIFIED"]);
export type UserStatus = (typeof userStatusEnum.enumValues)[number];

const usersTable = pgTable("users", {
  id: cuid().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  status: userStatusEnum().default("UNVERIFIED").notNull(),
  timezone: text(),
  fcmToken: text()
});

export default usersTable;
export type User = typeof usersTable.$inferSelect;
export type SafeUser = Omit<User, "password">;
