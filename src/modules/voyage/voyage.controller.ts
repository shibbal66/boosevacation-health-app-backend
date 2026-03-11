import { Controller, Post, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "middleware/auth.guard";
import { User } from "middleware/user.decorator";
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
  async getAllVoyages(@User("userId") userId: string) {
    const voyages = await this.voyageService.getAllVoyages(userId);
    return { data: voyages };
  }

  @Get(":voyageId")
  async getVoyageById(@User("userId") userId: string, @Param("voyageId") voyageId: string) {
    const voyage = await this.voyageService.getVoyageById(userId, voyageId);
    return { data: voyage };
  }
}
