import cuid from "common/cuid";
import { pgTable, unique, text } from "drizzle-orm/pg-core";
import usersTable from "models/users";
import videosTable from "models/videos";

const userVideosTable = pgTable(
  "user_videos",
  {
    id: cuid().primaryKey(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    videoId: text()
      .notNull()
      .references(() => videosTable.id, { onDelete: "cascade" })
  },
  (t) => [unique().on(t.userId, t.videoId)]
);

export default userVideosTable;
export type UserVideo = typeof userVideosTable.$inferSelect;
