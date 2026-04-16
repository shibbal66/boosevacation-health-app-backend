import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "middleware/auth.guard";
import { User } from "middleware/user.decorator";
import { WatchVideoDto } from "modules/video/video.dto";
import { VideoSeedService } from "modules/video/video.seed.service";
import { VideoService } from "modules/video/video.service";

@Controller("video")
@UseGuards(AuthGuard)
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoSeedService: VideoSeedService
  ) {}

  @Get()
  async getAllVideos(@User("userId") userId: string) {
    return this.videoService.getAllVideos(userId);
  }

  @Post("watch")
  watchVideo(@User("userId") userId: string, @Body() dto: WatchVideoDto) {
    return this.videoService.watchVideo(userId, dto.videoId);
  }

  @Get("seed")
  async seedVideos() {
    await this.videoSeedService.seed();
    return { message: "Videos seeded successfully" };
  }
}
