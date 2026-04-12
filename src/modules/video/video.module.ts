import { Module } from "@nestjs/common";
import { VideoController } from "modules/video/video.controller";
import { VideoService } from "modules/video/video.service";

@Module({
  controllers: [VideoController],
  providers: [VideoService]
})
export class VideoModule {}
