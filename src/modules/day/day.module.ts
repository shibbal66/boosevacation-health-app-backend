import { Module } from "@nestjs/common";
import { DayController } from "modules/day/day.controller";
import { DayService } from "modules/day/day.service";

@Module({
  providers: [DayService],
  controllers: [DayController]
})
export class DayModule {}
