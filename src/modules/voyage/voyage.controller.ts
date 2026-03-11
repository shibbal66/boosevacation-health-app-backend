import { Body, Controller, Get, Patch, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "middleware/auth.guard";
import { User } from "middleware/user.decorator";
import { GetVoyageDto, LogDayDto } from "modules/voyage/voyage.dto";
import { VoyageService } from "modules/voyage/voyage.service";

@Controller("voyage")
@UseGuards(AuthGuard)
export class VoyageController {
  constructor(private readonly voyageService: VoyageService) {}

  @Get()
  async getVoyage(@User("userId") userId: string, @Query() query: GetVoyageDto) {
    const voyage = await this.voyageService.getVoyage(userId, query.page ?? 1, query.limit ?? 7);
    return { data: voyage };
  }

  @Get("analytics")
  async getAnalytics(@User("userId") userId: string) {
    const analytics = await this.voyageService.getAnalytics(userId);
    return { data: analytics };
  }

  @Patch("log")
  async logDay(@User("userId") userId: string, @Body() dto: LogDayDto) {
    const day = await this.voyageService.logDay(userId, dto);
    return { data: day };
  }
}
