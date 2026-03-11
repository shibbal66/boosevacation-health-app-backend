import { IsBoolean, IsDateString, IsEnum, IsOptional } from "class-validator";
import { Mood } from "models/days";

export class GetVoyagesQueryDto {
  @IsOptional()
  @IsDateString({}, { message: "Date must be a valid ISO date string (YYYY-MM-DD)" })
  date?: string;
}

export class GetDayQueryDto {
  @IsDateString({}, { message: "Date must be a valid ISO date string (YYYY-MM-DD)" })
  date: string;
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
