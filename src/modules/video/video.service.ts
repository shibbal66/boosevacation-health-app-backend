import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import userVideosTable from "models/userVideos";
import videosTable, { type Video } from "models/videos";
import { DatabaseService } from "modules/database/database.service";

@Injectable()
export class VideoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllVideos(userId: string): Promise<{ data: (Video & { watched: boolean })[] }> {
    const videos = await this.databaseService.db
      .select({
        id: videosTable.id,
        title: videosTable.title,
        videoURL: videosTable.videoURL,
        description: videosTable.description,
        type: videosTable.type,
        week: videosTable.week,
        time: videosTable.time,
        createdAt: videosTable.createdAt,
        watched: userVideosTable.id
      })
      .from(videosTable)
      .leftJoin(userVideosTable, eq(videosTable.id, userVideosTable.videoId) && eq(userVideosTable.userId, userId));

    return {
      data: videos.map((video) => ({
        ...video,
        watched: video.watched !== null
      }))
    };
  }
}
