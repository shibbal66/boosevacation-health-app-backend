import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard } from "middleware/auth.guard";
import { User } from "middleware/user.decorator";
import {
  SignupDto,
  LoginDto,
  RefreshTokenDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  CheckOtpDto,
  ResetPasswordDto,
  ResendOtpDto
} from "modules/auth/auth.dto";
import { AuthService } from "modules/auth/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto);
  }

  @Post("verify-otp")
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return await this.authService.verifyOtp(dto);
  }

  @Post("resend-otp")
  async resendOtp(@Body() dto: ResendOtpDto) {
    return await this.authService.resendVerificationOtp(dto);
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return await this.authService.login(dto, req.ip!);
  }

  @Post("refresh-token")
  async refreshToken(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    return await this.authService.refreshToken(dto, req.ip!);
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  async logout(@User("userId") userId: string) {
    return await this.authService.logout(userId);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@User() user: Request["user"]) {
    return { data: user };
  }

  @Post("forgot-password")
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto);
  }

  @Post("check-otp")
  async checkOtp(@Body() dto: CheckOtpDto) {
    return await this.authService.checkOtp(dto);
  }

  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }
}
