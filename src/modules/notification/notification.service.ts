import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { eq } from "drizzle-orm";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging, Messaging } from "firebase-admin/messaging";
import usersTable from "models/users";
import { DatabaseService } from "modules/database/database.service";

@Injectable()
export class NotificationService {
  private readonly messaging: Messaging;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService
  ) {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: this.configService.getOrThrow<string>("FIREBASE_PROJECT_ID"),
          clientEmail: this.configService.getOrThrow<string>("FIREBASE_CLIENT_EMAIL"),
          privateKey: this.configService.getOrThrow<string>("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n")
        })
      });
    }

    this.messaging = getMessaging();
  }

  async sendToUser(userId: string, title: string, body: string, data?: Record<string, string>) {
    const [user] = await this.databaseService.db
      .select({ fcmToken: usersTable.fcmToken, notificationEnabled: usersTable.notificationEnabled })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (user && user.fcmToken && user.notificationEnabled) {
      await this.messaging.send({
        token: user.fcmToken,
        notification: { title, body },
        ...(data && { data })
      });
    }
  }

  async sendTestNotification(userId: string) {
    await this.sendToUser(userId, "Test Notification", "This is a test notification");
  }
}
