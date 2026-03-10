import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  status() {
    return { status: "OK", time: new Date().toISOString() };
  }
}
