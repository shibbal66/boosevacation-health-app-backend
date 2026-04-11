import { Injectable, NotFoundException } from "@nestjs/common";
import { eq, getTableColumns } from "drizzle-orm";
import usersTable, { type SafeUser } from "models/users";
import { DatabaseService } from "modules/database/database.service";
import type { UpdateUserDto } from "modules/user/user.dto";

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUser(userId: string): Promise<SafeUser> {
    const { password: _, ...safeColumns } = getTableColumns(usersTable);

    const [user] = await this.databaseService.db
      .select(safeColumns)
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user as SafeUser;
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<SafeUser> {
    const { password: _, ...safeColumns } = getTableColumns(usersTable);

    const [user] = await this.databaseService.db
      .update(usersTable)
      .set(dto)
      .where(eq(usersTable.id, userId))
      .returning(safeColumns);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user as SafeUser;
  }
}
