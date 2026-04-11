import { IsOptional, IsString, Matches, IsTimeZone, IsEnum, IsDateString } from "class-validator";
import { Trim } from "common/transformer";
import { programPhaseEnum, type ProgramPhase } from "models/users";

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
  @IsEnum(programPhaseEnum.enumValues, {
    message: `Program phase must be one of: ${programPhaseEnum.enumValues.join(", ")}`
  })
  programPhase?: ProgramPhase;

  @IsOptional()
  @IsDateString({}, { message: "Program start date must be a valid date" })
  programStartDate?: string;

  @IsOptional()
  @IsString({ message: "FCM Token must be a string" })
  @Trim()
  fcmToken?: string;
}
