import { Module } from "@nestjs/common";
import { CronService } from "modules/cron/cron.service";

@Module({
  providers: [CronService]
})
export class CronModule {}
