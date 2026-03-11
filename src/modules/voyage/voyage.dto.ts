import { IsOptional, IsDateString } from "class-validator";

export class GetVoyagesQueryDto {
  @IsOptional()
  @IsDateString({}, { message: "Date must be a valid ISO date string (YYYY-MM-DD)" })
  date?: string;
}
