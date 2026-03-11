import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { LoggerMiddleware } from "middleware/logger.middleware";
import { AuthModule } from "modules/auth/auth.module";
import { DatabaseModule } from "modules/database/database.module";
import { HashModule } from "modules/hash/hash.module";
import { JWTModule } from "modules/jwt/jwt.module";
import { NotificationModule } from "modules/notification/notification.module";
import { UserModule } from "modules/user/user.module";
import { VoyageModule } from "modules/voyage/voyage.module";
import { AppController } from "src/app.controller";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 50 }]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    DatabaseModule,
    JWTModule,
    HashModule,
    AuthModule,
    UserModule,
    VoyageModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
