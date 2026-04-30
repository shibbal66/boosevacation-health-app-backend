import { IsString, IsEnum, IsInt, IsOptional, IsArray } from "class-validator";
import { Trim } from "common/transformer";
import { videoTypeEnum, type VideoType } from "models/videos";

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

  @IsArray({ message: "Messages must be an array" })
  @IsString({ each: true, message: "Each message must be a string" })
  @IsOptional()
  messages?: string[];

  @IsEnum(videoTypeEnum.enumValues, { message: `Type must be one of: ${videoTypeEnum.enumValues.join(", ")}` })
  type: VideoType;

  @IsInt({ message: "Week must be an integer" })
  @IsOptional()
  week?: number | null;

  @IsInt({ message: "Day must be an integer" })
  @IsOptional()
  day?: number | null;

  @IsInt({ message: "Duration must be an integer" })
  duration: number;
}

export class WatchVideoDto {
  @IsString({ message: "Video ID must be a string" })
  @Trim()
  videoId: string;
}
