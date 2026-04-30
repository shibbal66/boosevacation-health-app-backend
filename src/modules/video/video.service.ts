import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import userVideosTable from "models/userVideos";
import videosTable, { type Video, type VideoType } from "models/videos";
import { DatabaseService } from "modules/database/database.service";
import { CreateVideoDto } from "modules/video/video.dto";

type VideoWithWatched = Video & { watched: boolean };

@Injectable()
export class VideoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllVideos(userId: string): Promise<{ data: Record<VideoType, VideoWithWatched[]> }> {
    const videos = await this.databaseService.db
      .select({
        id: videosTable.id,
        title: videosTable.title,
        thumbnail: videosTable.thumbnail,
        videoURL: videosTable.videoURL,
        description: videosTable.description,
        messages: videosTable.messages,
        type: videosTable.type,
        week: videosTable.week,
        day: videosTable.day,
        duration: videosTable.duration,
        createdAt: videosTable.createdAt,
        watched: userVideosTable.id
      })
      .from(videosTable)
      .leftJoin(userVideosTable, and(eq(videosTable.id, userVideosTable.videoId), eq(userVideosTable.userId, userId)));

    const grouped = videos.reduce(
      (acc, video) => {
        const type = video.type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push({ ...video, watched: video.watched !== null });
        return acc;
      },
      {} as Record<VideoType, VideoWithWatched[]>
    );

    return { data: grouped };
  }

  async watchVideo(userId: string, videoId: string): Promise<{ message: string }> {
    await this.databaseService.db.insert(userVideosTable).values({ userId, videoId }).onConflictDoNothing();

    return { message: "Video marked as watched" };
  }

  async createVideo(data: CreateVideoDto): Promise<{ data: Video }> {
    const result = await this.databaseService.db.insert(videosTable).values(data).returning();

    return { data: result[0] };
  }

  async deleteVideo(videoId: string): Promise<{ message: string }> {
    await this.databaseService.db.delete(videosTable).where(eq(videosTable.id, videoId));

    return { message: "Video deleted successfully" };
  }
}
