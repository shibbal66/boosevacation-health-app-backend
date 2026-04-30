import { Module } from "@nestjs/common";
import { DayController } from "modules/day/day.controller";
import { DayService } from "modules/day/day.service";
import { QuoteSeedService } from "modules/day/quote.seed.service";

@Module({
  providers: [DayService, QuoteSeedService],
  controllers: [DayController]
})
export class DayModule {}
