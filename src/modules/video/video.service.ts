import { Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import userVideosTable from "models/userVideos";
import videosTable, { type Video, type VideoType } from "models/videos";
import { DatabaseService } from "modules/database/database.service";

type VideoWithWatched = Video & { watched: boolean };

@Injectable()
export class VideoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllVideos(userId: string): Promise<{ data: Record<VideoType, VideoWithWatched[]> }> {
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

  async watchVideo(userId: string, videoId: string): Promise<{ data: { message: string } }> {
    await this.databaseService.db.insert(userVideosTable).values({ userId, videoId }).onConflictDoNothing();

    return { data: { message: "Video marked as watched" } };
  }
}
