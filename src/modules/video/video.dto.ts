import { IsString, IsEnum, IsInt, IsOptional } from "class-validator";
import { Trim } from "common/transformer";
import { videoTypeEnum, type VideoType } from "models/videos";

export class WatchVideoDto {
  @IsString({ message: "Video ID must be a string" })
  @Trim()
  videoId: string;
}

export class CreateVideoDto {
  @IsString({ message: "Title must be a string" })
  @Trim()
  title: string;

  @IsString({ message: "Thumbnail must be a string" })
  @Trim()
  thumbnail: string;

  @IsString({ message: "Video URL must be a string" })
  @Trim()
  videoURL: string;

  @IsString({ message: "Description must be a string" })
  @Trim()
  description: string;

  @IsEnum(videoTypeEnum.enumValues, { message: `Type must be one of: ${videoTypeEnum.enumValues.join(", ")}` })
  type: VideoType;

  @IsInt({ message: "Time must be an integer" })
  time: number;

  @IsInt({ message: "Week must be an integer" })
  @IsOptional()
  week?: number | null;
}
