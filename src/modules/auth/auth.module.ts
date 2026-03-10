import { Module } from "@nestjs/common";
import { AuthController } from "modules/auth/auth.controller";
import { AuthService } from "modules/auth/auth.service";
import { HashModule } from "modules/hash/hash.module";

@Module({
  imports: [HashModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
