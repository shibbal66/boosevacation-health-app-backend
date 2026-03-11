import { Controller, Post, Param, UseGuards } from "@nestjs/common";
import { ParamDto } from "common/common.dto";
import { AuthGuard } from "middleware/auth.guard";
import { NotificationService } from "modules/notification/notification.service";

@Controller("notification")
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post("test/:id")
  async sendTest(@Param() { id }: ParamDto) {
    await this.notificationService.sendTestNotification(id);
    return { message: "Test notification sent" };
  }
}
