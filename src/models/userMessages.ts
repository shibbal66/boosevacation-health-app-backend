import cuid from "common/cuid";
import { pgTable, unique, text } from "drizzle-orm/pg-core";
import messagesTable from "models/messages";
import usersTable from "models/users";

const userMessagesTable = pgTable(
  "user_messages",
  {
    id: cuid().primaryKey(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    messageId: text()
      .notNull()
      .references(() => messagesTable.id, { onDelete: "cascade" })
  },
  (t) => [unique().on(t.userId, t.messageId)]
);

export default userMessagesTable;
export type UserMessage = typeof userMessagesTable.$inferSelect;
