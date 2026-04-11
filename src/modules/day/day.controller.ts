import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "middleware/auth.guard";
import { User } from "middleware/user.decorator";
import { CreateDayLogDto } from "modules/day/day.dto";
import { DayService } from "modules/day/day.service";

@Controller("day")
@UseGuards(AuthGuard)
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @Get()
  async getAllDayLogs(@User("userId") userId: string) {
    return this.dayService.getAllDayLogs(userId);
  }

  @Post()
  async addDayLog(@User("userId") userId: string, @Body() dto: CreateDayLogDto) {
    return this.dayService.addDayLog(userId, dto);
  }
}
