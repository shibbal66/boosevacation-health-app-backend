import { IsOptional, IsString, IsBoolean, Matches, IsTimeZone } from "class-validator";
import { Trim } from "common/transformer";

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @Matches(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" })
  @Trim()
  name?: string;

  @IsOptional()
  @IsBoolean({ message: "notificationEnabled must be a boolean" })
  notificationEnabled?: boolean;

  @IsOptional()
  @IsString({ message: "notificationTime must be a string" })
  @Matches(/^\d{2}:\d{2}$/, { message: "notificationTime must be in HH:MM format" })
  notificationTime?: string;

  @IsOptional()
  @IsTimeZone({ message: "timezone must be a valid IANA timezone" })
  timezone?: string;

  @IsOptional()
  @IsString({ message: "fcmToken must be a string" })
  @Trim()
  fcmToken?: string;
}
