import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, Matches, Max, Min, ValidateNested } from "class-validator";
import { dayLogTypeEnum, type DayLogType } from "models/dayLog";

class LogsDto {
  @IsBoolean()
  noScreen: boolean;

  @IsBoolean()
  warmDrink: boolean;

  @IsBoolean()
  gratitude: boolean;

  @IsBoolean()
  roomTemperatureSet: boolean;

  @IsBoolean()
  meditation: boolean;

  @IsBoolean()
  morningSunlight: boolean;

  @IsBoolean()
  coldShower: boolean;

  @IsBoolean()
  hydrate: boolean;

  @IsBoolean()
  noCaffeine: boolean;

  @IsBoolean()
  exercise: boolean;
}

export class CreateDayLogDto {
  @IsDateString()
  date!: string;

  @IsEnum(dayLogTypeEnum.enumValues, { message: `Type must be one of: ${dayLogTypeEnum.enumValues.join(", ")}` })
  type!: DayLogType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  feeling?: number | null;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Bed Time must be in HH:MM format" })
  bedtime?: string | null;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Wake Time must be in HH:MM format" })
  wakeTime?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  sleepQuality?: number | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => LogsDto)
  logs?: LogsDto | null;
}
