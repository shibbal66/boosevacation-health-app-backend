import cuid from "common/cuid";
import { pgTable, text, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", ["VERIFIED", "UNVERIFIED"]);
export type UserStatus = (typeof userStatusEnum.enumValues)[number];

export const programPhaseEnum = pgEnum("program_phase", ["TUTORIAL", "VOYAGE"]);
export type ProgramPhase = (typeof programPhaseEnum.enumValues)[number];

const usersTable = pgTable("users", {
  id: cuid().primaryKey(),
  name: text().notNull(),
  nickname: text(),
  email: text().notNull().unique(),
  password: text().notNull(),
  status: userStatusEnum().default("UNVERIFIED").notNull(),
  timezone: text(),
  programPhase: programPhaseEnum().default("TUTORIAL").notNull(),
  programStartDate: timestamp().defaultNow().notNull(),
  fcmToken: text()
});

export default usersTable;
export type User = typeof usersTable.$inferSelect;
export type SafeUser = Omit<User, "password">;
