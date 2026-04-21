import { IsString, IsEnum, IsInt, IsArray, IsOptional } from "class-validator";
import { Trim } from "common/transformer";
import { messageTypeEnum, type MessageType } from "models/messages";

export class GetMessageQueryDto {
  @IsOptional()
  @IsEnum(messageTypeEnum.enumValues, { message: `Type must be one of: ${messageTypeEnum.enumValues.join(", ")}` })
  type?: MessageType;
}

export class CreateMessageDto {
  @IsString({ message: "Title must be a string" })
  @Trim()
  title: string;

  @IsEnum(messageTypeEnum.enumValues, { message: `Type must be one of: ${messageTypeEnum.enumValues.join(", ")}` })
  type: MessageType;

  @IsOptional()
  @IsInt({ message: "Week must be an integer" })
  week?: number;

  @IsOptional()
  @IsInt({ message: "Day must be an integer" })
  day?: number;

  @IsString({ message: "Thumbnail must be a string" })
  @Trim()
  thumbnail: string;

  @IsString({ message: "Video URL must be a string" })
  @Trim()
  videoURL: string;

  @IsArray({ message: "Messages must be an array" })
  @IsString({ each: true, message: "Each message must be a string" })
  messages: string[];
}
