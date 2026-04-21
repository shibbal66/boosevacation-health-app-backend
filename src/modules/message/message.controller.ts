import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ParamDto } from "common/common.dto";
import { AuthGuard } from "middleware/auth.guard";
import { GetMessageQueryDto, CreateMessageDto } from "modules/message/message.dto";
import { MessageService } from "modules/message/message.service";

@Controller("message")
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getMessages(@Query() query: GetMessageQueryDto) {
    return this.messageService.getMessages(query);
  }

  @Post()
  async createMessage(@Body() dto: CreateMessageDto) {
    return this.messageService.createMessage(dto);
  }

  @Delete(":id")
  async deleteMessage(@Param() dto: ParamDto) {
    return this.messageService.deleteMessage(dto.id);
  }
}
