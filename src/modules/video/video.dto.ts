import { Type } from "class-transformer";
import { IsString, IsEnum, IsInt, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Trim } from "common/transformer";
import { videoTypeEnum, type VideoType } from "models/videos";

export class VideoMessagesDto {
  @IsString({ message: "Theme must be a string" })
  @IsOptional()
  theme?: string;

  @IsString({ message: "What to expect must be a string" })
  @IsOptional()
  whatToExpect?: string;

  @IsString({ message: "Objective must be a string" })
  @IsOptional()
  objective?: string;

  @IsArray({ message: "Focus areas must be an array" })
  @IsString({ each: true, message: "Each focus area must be a string" })
  @IsOptional()
  focusAreas?: string[];

  @IsArray({ message: "Resources must be an array" })
  @IsString({ each: true, message: "Each resource must be a string" })
  @IsOptional()
  resources?: string[];

  @IsArray({ message: "Paths must be an array" })
  @IsString({ each: true, message: "Each path must be a string" })
  @IsOptional()
  paths?: string[];
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

  @ValidateNested()
  @Type(() => VideoMessagesDto)
  @IsOptional()
  messages?: VideoMessagesDto;

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
