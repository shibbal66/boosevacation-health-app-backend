import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { lt } from "drizzle-orm";
import sessionsTable from "models/sessions";
import verificationsTable from "models/verifications";
import { DatabaseService } from "modules/database/database.service";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async cleanExpiredData() {
    await this.cleanExpiredSessions();
    await this.cleanExpiredVerifications();
  }

  private async cleanExpiredSessions() {
    try {
      const now = new Date();
      const result = await this.databaseService.db.delete(sessionsTable).where(lt(sessionsTable.expiryTime, now));

      this.logger.log(`Cleaned ${result.rowCount} expired sessions at ${now.toISOString()}`);
      return result;
    } catch (error) {
      this.logger.error(`Error cleaning expired sessions: ${error}`);
      throw error;
    }
  }

  private async cleanExpiredVerifications() {
    try {
      const now = new Date();
      const result = await this.databaseService.db
        .delete(verificationsTable)
        .where(lt(verificationsTable.expiresAt, now));

      this.logger.log(`Cleaned ${result.rowCount} expired verifications at ${now.toISOString()}`);
      return result;
    } catch (error) {
      this.logger.error(`Error cleaning expired verifications: ${error}`);
      throw error;
    }
  }
}
