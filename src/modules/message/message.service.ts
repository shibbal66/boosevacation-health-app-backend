import { Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, SQL } from "drizzle-orm";
import messagesTable, { type Message, type MessageType } from "models/messages";
import userMessagesTable from "models/userMessages";
import { DatabaseService } from "modules/database/database.service";
import { CreateMessageDto, GetMessageQueryDto } from "modules/message/message.dto";

type MessageWithWatched = Message & { watched: boolean };

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getMessages(
    query: GetMessageQueryDto,
    userId: string
  ): Promise<{ data: Record<MessageType, MessageWithWatched[]> }> {
    const conditions: SQL[] = [];

    if (query.type) {
      conditions.push(eq(messagesTable.type, query.type));
    }

    const messages = await this.databaseService.db
      .select({
        id: messagesTable.id,
        title: messagesTable.title,
        type: messagesTable.type,
        week: messagesTable.week,
        day: messagesTable.day,
        thumbnail: messagesTable.thumbnail,
        videoURL: messagesTable.videoURL,
        messages: messagesTable.messages,
        createdAt: messagesTable.createdAt,
        watched: userMessagesTable.id
      })
      .from(messagesTable)
      .leftJoin(
        userMessagesTable,
        and(eq(messagesTable.id, userMessagesTable.messageId), eq(userMessagesTable.userId, userId))
      )
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const grouped = messages.reduce(
      (acc, message) => {
        const type = message.type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push({ ...message, watched: message.watched !== null });
        return acc;
      },
      {} as Record<MessageType, MessageWithWatched[]>
    );

    return { data: grouped };
  }

  async createMessage(data: CreateMessageDto): Promise<{ data: Message }> {
    const result = await this.databaseService.db.insert(messagesTable).values(data).returning();

    return { data: result[0] };
  }

  async watchMessage(userId: string, messageId: string): Promise<{ message: string }> {
    const message = await this.databaseService.db
      .select({ id: messagesTable.id })
      .from(messagesTable)
      .where(eq(messagesTable.id, messageId))
      .limit(1);

    if (message.length === 0) {
      throw new NotFoundException("Message not found");
    }

    await this.databaseService.db.insert(userMessagesTable).values({ userId, messageId }).onConflictDoNothing();

    return { message: "Message marked as watched" };
  }

  async deleteMessage(messageId: string): Promise<{ message: string }> {
    await this.databaseService.db.delete(messagesTable).where(eq(messagesTable.id, messageId));

    return { message: "Message deleted successfully" };
  }
}
