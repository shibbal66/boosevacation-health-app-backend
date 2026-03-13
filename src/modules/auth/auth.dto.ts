import { IsNotEmpty, IsString, IsEmail, MinLength, Matches, IsOptional, IsTimeZone } from "class-validator";
import { Trim, Lowercase } from "common/transformer";

export class SignupDto {
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  @Matches(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" })
  @Trim()
  name: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  @Trim()
  @Lowercase()
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
    message: "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character"
  })
  @Trim()
  password: string;

  @IsOptional()
  @IsTimeZone({ message: "Timezone must be a valid IANA timezone" })
  timezone?: string;
}

export class LoginDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  @Trim()
  @Lowercase()
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
    message: "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character"
  })
  @Trim()
  password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty({ message: "Refresh token is required" })
  @IsString({ message: "Refresh token must be a string" })
  refreshToken: string;
}
