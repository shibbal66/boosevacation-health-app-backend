import { Controller, Get } from "@nestjs/common";
import { User } from "middleware/user.decorator";
import { VideoService } from "modules/video/video.service";

@Controller("video")
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async getAllVideos(@User("userId") userId: string) {
    return this.videoService.getAllVideos(userId);
  }
}
