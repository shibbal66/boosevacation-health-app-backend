import { IsOptional, IsString, Matches, IsTimeZone } from "class-validator";
import { Trim } from "common/transformer";

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @Matches(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" })
  @Trim()
  name?: string;

  @IsOptional()
  @IsTimeZone({ message: "Timezone must be a valid IANA timezone" })
  timezone?: string;

  @IsOptional()
  @IsString({ message: "FCM Token must be a string" })
  @Trim()
  fcmToken?: string;
}
