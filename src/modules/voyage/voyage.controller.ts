import { Body, Controller, Post, Get, Patch, Param, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "middleware/auth.guard";
import { User } from "middleware/user.decorator";
import { GetVoyagesQueryDto, LogDayDto } from "modules/voyage/voyage.dto";
import { VoyageService } from "modules/voyage/voyage.service";

@Controller("voyage")
@UseGuards(AuthGuard)
export class VoyageController {
  constructor(private readonly voyageService: VoyageService) {}

  @Post()
  async createVoyage(@User("userId") userId: string) {
    const voyage = await this.voyageService.createVoyage(userId);
    return { data: voyage };
  }

  @Get()
  async getAllVoyages(@User("userId") userId: string, @Query() query: GetVoyagesQueryDto) {
    const voyages = await this.voyageService.getAllVoyages(userId, query.date);
    return { data: voyages };
  }

  @Get(":voyageId")
  async getVoyageById(@User("userId") userId: string, @Param("voyageId") voyageId: string) {
    const voyage = await this.voyageService.getVoyageById(userId, voyageId);
    return { data: voyage };
  }

  @Get("day/:date")
  async getDay(@User("userId") userId: string, @Param("date") date: string) {
    const result = await this.voyageService.getDay(userId, date);
    return { data: result };
  }

  @Patch("log")
  async logDay(@User("userId") userId: string, @Body() dto: LogDayDto) {
    const day = await this.voyageService.logDay(userId, dto);
    return { data: day };
  }
}
