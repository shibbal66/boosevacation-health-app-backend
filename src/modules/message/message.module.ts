import { Module } from "@nestjs/common";
import { MessageController } from "modules/message/message.controller";
import { MessageService } from "modules/message/message.service";

@Module({
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
