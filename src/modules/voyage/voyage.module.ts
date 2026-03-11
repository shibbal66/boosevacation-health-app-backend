import { Module } from "@nestjs/common";
import { VoyageController } from "modules/voyage/voyage.controller";
import { VoyageService } from "modules/voyage/voyage.service";

@Module({
  providers: [VoyageService],
  controllers: [VoyageController]
})
export class VoyageModule {}
