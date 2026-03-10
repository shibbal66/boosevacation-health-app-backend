import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { eq, getTableColumns } from "drizzle-orm";
import sessionsTable from "models/sessions";
import usersTable from "models/users";
import type { SafeUser } from "models/users";
import type { SignupDto, LoginDto } from "modules/auth/auth.dto";
import { DatabaseService } from "modules/database/database.service";
import { HashService } from "modules/hash/hash.service";
import { JWTService } from "modules/jwt/jwt.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JWTService,
    private readonly hashService: HashService
  ) {}

  async signup(dto: SignupDto) {
    const { password: _, ...safeColumns } = getTableColumns(usersTable);

    const [existingUser] = await this.databaseService.db
      .select(safeColumns)
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const [user] = await this.databaseService.db
      .insert(usersTable)
      .values({
        name: dto.name,
        email: dto.email,
        password: hashedPassword
      })
      .returning(safeColumns);

    if (!user) {
      throw new ConflictException("Failed to create user");
    }

    return { message: "User created successfully" };
  }

  async login(dto: LoginDto, ipAddress: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await this.hashService.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      name: user.name,
      email: user.email
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      userId: user.id
    });

    const refreshTokenHash = await this.hashService.hash(refreshToken);
    const ipAddressCleaned = ipAddress.split(".").slice(0, 2).join(".");

    await this.databaseService.db.insert(sessionsTable).values({
      userId: user.id,
      refreshTokenHash,
      ipAddress: ipAddressCleaned,
      expiryTime: new Date(Date.now() + this.jwtService.refreshTokenMaxAge)
    });

    const { password: _, ...safeUser } = user;

    return {
      data: {
        accessToken,
        refreshToken,
        user: safeUser as SafeUser
      }
    };
  }

  async refreshToken(token: string, ipAddress: string) {
    const decoded = this.jwtService.verifyToken(token);
    const userId = (decoded.data as { userId?: string })?.userId;

    if (!userId) {
      throw new UnauthorizedException("Invalid token");
    }

    const [session] = await this.databaseService.db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.userId, userId))
      .limit(1);

    if (!session) {
      throw new UnauthorizedException("Invalid session");
    }

    const isTokenValid = await this.hashService.compare(token, session.refreshTokenHash);

    if (!isTokenValid) {
      throw new UnauthorizedException("Invalid session");
    }

    const ipAddressCleaned = ipAddress.split(".").slice(0, 2).join(".");

    if (session.ipAddress !== ipAddressCleaned) {
      throw new UnauthorizedException("Invalid session");
    }

    const { password: _, ...safeColumns } = getTableColumns(usersTable);

    const [user] = await this.databaseService.db
      .select(safeColumns)
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException("Invalid session");
    }

    await this.databaseService.db.delete(sessionsTable).where(eq(sessionsTable.userId, user.id));

    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      name: user.name,
      email: user.email
    });

    const newRefreshToken = this.jwtService.generateRefreshToken({
      userId: user.id
    });

    const refreshTokenHash = await this.hashService.hash(newRefreshToken);

    await this.databaseService.db.insert(sessionsTable).values({
      userId: user.id,
      refreshTokenHash,
      ipAddress: ipAddressCleaned,
      expiryTime: new Date(Date.now() + this.jwtService.refreshTokenMaxAge)
    });

    return {
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        user: user as SafeUser
      }
    };
  }

  async logout(userId: string) {
    await this.databaseService.db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
  }
}
