import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Mood } from "models/days";

export class GetVoyageDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class LogDayDto {
  @IsOptional()
  @IsBoolean({ message: "Alcohol must be a boolean" })
  alcohol?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Caffeine must be a boolean" })
  caffeine?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Food must be a boolean" })
  food?: boolean;

  @IsOptional()
  @IsEnum(Mood, { message: `Mood must be one of: ${Object.values(Mood).join(", ")}` })
  mood?: Mood;
}
