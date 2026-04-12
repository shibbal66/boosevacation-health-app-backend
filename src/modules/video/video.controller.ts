import { Body, Controller, Get, Post } from "@nestjs/common";
import { User } from "middleware/user.decorator";
import { WatchVideoDto } from "modules/video/video.dto";
import { VideoService } from "modules/video/video.service";

@Controller("video")
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async getAllVideos(@User("userId") userId: string) {
    return this.videoService.getAllVideos(userId);
  }

  @Post("watch")
  watchVideo(@User("userId") userId: string, @Body() dto: WatchVideoDto) {
    return this.videoService.watchVideo(userId, dto.videoId);
  }
}
