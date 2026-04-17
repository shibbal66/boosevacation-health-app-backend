import cuid from "common/cuid";
import { pgTable, text, pgEnum, timestamp, integer } from "drizzle-orm/pg-core";

export const videoTypeEnum = pgEnum("video_type", ["ORIENTATION", "BLOG"]);
export type VideoType = (typeof videoTypeEnum.enumValues)[number];

const videosTable = pgTable("videos", {
  id: cuid().primaryKey(),
  title: text().notNull(),
  thumbnail: text().notNull(),
  videoURL: text().notNull(),
  description: text().notNull(),
  type: videoTypeEnum().notNull(),
  week: integer(),
  time: integer().notNull(),
  createdAt: timestamp().defaultNow().notNull()
});

export default videosTable;
export type Video = typeof videosTable.$inferSelect;
