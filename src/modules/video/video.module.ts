import { Module } from "@nestjs/common";
import { VideoController } from "modules/video/video.controller";
import { VideoSeedService } from "modules/video/video.seed.service";
import { VideoService } from "modules/video/video.service";

@Module({
  controllers: [VideoController],
  providers: [VideoService, VideoSeedService]
})
export class VideoModule {}
