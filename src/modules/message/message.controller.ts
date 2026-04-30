import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ParamDto } from "common/common.dto";
import { AuthGuard } from "middleware/auth.guard";
import { User } from "middleware/user.decorator";
import { GetMessageQueryDto, CreateMessageDto, WatchMessageDto } from "modules/message/message.dto";
import { MessageService } from "modules/message/message.service";

@Controller("message")
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getMessages(@Query() query: GetMessageQueryDto, @User("userId") userId: string) {
    return this.messageService.getMessages(query, userId);
  }

  @Post()
  async createMessage(@Body() dto: CreateMessageDto) {
    return this.messageService.createMessage(dto);
  }

  @Post("watch")
  watchMessage(@User("userId") userId: string, @Body() dto: WatchMessageDto) {
    return this.messageService.watchMessage(userId, dto.messageId);
  }

  @Delete(":id")
  async deleteMessage(@Param() dto: ParamDto) {
    return this.messageService.deleteMessage(dto.id);
  }
}
