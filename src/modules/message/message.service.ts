import { Injectable } from "@nestjs/common";
import { and, eq, SQL } from "drizzle-orm";
import messagesTable, { type Message } from "models/messages";
import { DatabaseService } from "modules/database/database.service";
import { CreateMessageDto, GetMessageQueryDto } from "modules/message/message.dto";

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getMessages(query: GetMessageQueryDto): Promise<{ data: Message[] }> {
    const conditions: SQL[] = [];

    if (query.type) {
      conditions.push(eq(messagesTable.type, query.type));
    }

    const messages = await this.databaseService.db
      .select()
      .from(messagesTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return { data: messages };
  }

  async createMessage(data: CreateMessageDto): Promise<{ data: Message }> {
    const result = await this.databaseService.db.insert(messagesTable).values(data).returning();

    return { data: result[0] };
  }

  async deleteMessage(messageId: string): Promise<{ message: string }> {
    await this.databaseService.db.delete(messagesTable).where(eq(messagesTable.id, messageId));

    return { message: "Message deleted successfully" };
  }
}
