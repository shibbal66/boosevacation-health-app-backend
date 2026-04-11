import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "middleware/auth.guard";
import { User } from "middleware/user.decorator";
import { UpdateUserDto } from "modules/user/user.dto";
import { UserService } from "modules/user/user.service";

@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  async getUser(@User("userId") userId: string) {
    const user = await this.userService.getUser(userId);
    return { data: user };
  }

  @Patch("me")
  async updateUser(@User("userId") userId: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.updateUser(userId, dto);
    return { data: user };
  }
}
