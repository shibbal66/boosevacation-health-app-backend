import { Module } from "@nestjs/common";
import { NotificationController } from "modules/notification/notification.controller";
import { NotificationService } from "modules/notification/notification.service";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
