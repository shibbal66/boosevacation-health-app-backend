import { Module } from "@nestjs/common";
import { CronService } from "modules/cron/cron.service";
import { NotificationModule } from "modules/notification/notification.module";

@Module({
  imports: [NotificationModule],
  providers: [CronService]
})
export class CronModule {}
