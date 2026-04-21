import cuid from "common/cuid";
import { pgTable, text, pgEnum, timestamp, integer } from "drizzle-orm/pg-core";

export const messageTypeEnum = pgEnum("message_type", ["ALCOHOL", "HOME", "SLEEP"]);
export type MessageType = (typeof messageTypeEnum.enumValues)[number];

const messagesTable = pgTable("messages", {
  id: cuid().primaryKey(),
  title: text().notNull(),
  type: messageTypeEnum().notNull(),
  week: integer(),
  day: integer(),
  thumbnail: text().notNull(),
  videoURL: text().notNull(),
  messages: text().array().notNull(),
  createdAt: timestamp().defaultNow().notNull()
});

export default messagesTable;
export type Message = typeof messagesTable.$inferSelect;
