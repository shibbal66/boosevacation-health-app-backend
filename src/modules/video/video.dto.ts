import { IsString } from "class-validator";
import { Trim } from "common/transformer";

export class WatchVideoDto {
  @IsString({ message: "Video ID must be a string" })
  @Trim()
  videoId: string;
}
