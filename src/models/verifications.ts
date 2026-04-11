import cuid from "common/cuid";
import { pgTable, text, timestamp, boolean, index, pgEnum } from "drizzle-orm/pg-core";
import usersTable from "models/users";

export const verificationTypeEnum = pgEnum("verification_type", ["VERIFY", "RESET"]);
export type VerificationType = (typeof verificationTypeEnum.enumValues)[number];

const verificationsTable = pgTable(
  "verifications",
  {
    id: cuid().primaryKey(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: verificationTypeEnum().notNull(),
    otp: text().notNull(),
    expiresAt: timestamp({ withTimezone: true, mode: "date" }).notNull(),
    used: boolean().default(false).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "date" }).defaultNow().notNull()
  },
  (table) => [index().on(table.userId), index().on(table.otp), index().on(table.expiresAt), index().on(table.used)]
);

export default verificationsTable;
export type Verification = typeof verificationsTable.$inferSelect;
