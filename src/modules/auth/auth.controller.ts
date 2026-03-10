import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard } from "middleware/auth.guard";
import { User } from "middleware/user.decorator";
import { SignupDto, LoginDto, RefreshTokenDto } from "modules/auth/auth.dto";
import { AuthService } from "modules/auth/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto);
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    return await this.authService.login(dto, req.ip!);
  }

  @Post("refresh-token")
  async refreshToken(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    return await this.authService.refreshToken(dto.refreshToken, req.ip!);
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  async logout(@User("userId") userId: string) {
    await this.authService.logout(userId);
    return { message: "Logged out successfully" };
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@User() user: Request["user"]) {
    return { data: user };
  }
}
