import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from "@nestjs/common";
import { eq, getTableColumns, and } from "drizzle-orm";
import sessionsTable from "models/sessions";
import usersTable, { type SafeUser } from "models/users";
import verificationsTable from "models/verifications";
import type {
  SignupDto,
  LoginDto,
  VerifyOtpDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  CheckOtpDto,
  ResetPasswordDto,
  ResendOtpDto
} from "modules/auth/auth.dto";
import { DatabaseService } from "modules/database/database.service";
import { HashService } from "modules/hash/hash.service";
import { JWTService } from "modules/jwt/jwt.service";
import { MailService } from "modules/mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JWTService,
    private readonly hashService: HashService,
    private readonly mailService: MailService
  ) {}

  async signup(dto: SignupDto) {
    const { password: _, ...safeColumns } = getTableColumns(usersTable);

    const [existingUser] = await this.databaseService.db
      .select(safeColumns)
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (existingUser && existingUser.status === "VERIFIED") {
      throw new ConflictException("Email already exists");
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const [user] = await this.databaseService.db
      .insert(usersTable)
      .values({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        timezone: dto.timezone
      })
      .onConflictDoUpdate({
        target: usersTable.email,
        set: {
          name: dto.name,
          password: hashedPassword,
          timezone: dto.timezone
        }
      })
      .returning(safeColumns);

    if (!user) {
      throw new ConflictException("Failed to create user");
    }

    await this.databaseService.db.delete(verificationsTable).where(eq(verificationsTable.userId, user.id));

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.databaseService.db.insert(verificationsTable).values({
      userId: user.id,
      type: "VERIFY",
      otp,
      expiresAt
    });

    await this.mailService.sendVerificationEmail(user.email, user.name, otp);

    return { message: "User created successfully. Verification email sent." };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const [user] = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const [verification] = await this.databaseService.db
      .select()
      .from(verificationsTable)
      .where(and(eq(verificationsTable.userId, user.id), eq(verificationsTable.otp, dto.otp)))
      .limit(1);

    if (!verification) {
      throw new BadRequestException("Invalid OTP");
    }

    if (new Date() > verification.expiresAt) {
      throw new BadRequestException("OTP has expired");
    }

    if (verification.used) {
      throw new BadRequestException("OTP has already been used");
    }

    await this.databaseService.db
      .update(verificationsTable)
      .set({ used: true })
      .where(eq(verificationsTable.id, verification.id));

    const [updatedUser] = await this.databaseService.db
      .update(usersTable)
      .set({ status: "VERIFIED" })
      .where(eq(usersTable.id, user.id))
      .returning();

    if (!updatedUser) {
      throw new ConflictException("Failed to verify user");
    }

    return { message: "Account verified successfully" };
  }

  async resendVerificationOtp(dto: ResendOtpDto) {
    const { password: _, ...safeColumns } = getTableColumns(usersTable);

    const [user] = await this.databaseService.db
      .select(safeColumns)
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.status === "VERIFIED") {
      throw new BadRequestException("User is already verified");
    }

    await this.databaseService.db.delete(verificationsTable).where(eq(verificationsTable.userId, user.id));

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.databaseService.db.insert(verificationsTable).values({
      userId: user.id,
      type: "VERIFY",
      otp,
      expiresAt
    });

    await this.mailService.sendVerificationEmail(user.email, user.name, otp);

    return { message: "Verification email resent" };
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

  async refreshToken(dto: RefreshTokenDto, ipAddress: string) {
    const decoded = this.jwtService.verifyToken(dto.refreshToken);
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

    const isTokenValid = await this.hashService.compare(dto.refreshToken, session.refreshTokenHash);

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
    return { message: "Logged out successfully" };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const [user] = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (user && user.status === "UNVERIFIED") {
      throw new ForbiddenException("Please verify your email before resetting your password");
    }

    if (user) {
      await this.databaseService.db
        .delete(verificationsTable)
        .where(and(eq(verificationsTable.userId, user.id), eq(verificationsTable.type, "RESET")));

      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await this.databaseService.db.insert(verificationsTable).values({
        userId: user.id,
        type: "RESET",
        otp,
        expiresAt
      });

      await this.mailService.sendResetEmail(user.email, user.name, otp);
    }

    return {
      message: "If an account with that email exists, we have sent a password reset email"
    };
  }

  async checkOtp(dto: CheckOtpDto) {
    const [user] = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const [verification] = await this.databaseService.db
      .select()
      .from(verificationsTable)
      .where(
        and(
          eq(verificationsTable.userId, user.id),
          eq(verificationsTable.otp, dto.otp),
          eq(verificationsTable.type, "RESET")
        )
      )
      .limit(1);

    if (!verification) {
      throw new BadRequestException("Invalid OTP");
    }

    if (new Date() > verification.expiresAt) {
      throw new BadRequestException("OTP has expired");
    }

    if (verification.used) {
      throw new BadRequestException("OTP has already been used");
    }

    return {
      valid: true,
      message: "OTP is valid"
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const [user] = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, dto.email))
      .limit(1);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const [verification] = await this.databaseService.db
      .select()
      .from(verificationsTable)
      .where(
        and(
          eq(verificationsTable.userId, user.id),
          eq(verificationsTable.otp, dto.otp),
          eq(verificationsTable.type, "RESET")
        )
      )
      .limit(1);

    if (!verification) {
      throw new BadRequestException("Invalid OTP");
    }

    if (new Date() > verification.expiresAt) {
      throw new BadRequestException("OTP has expired");
    }

    if (verification.used) {
      throw new BadRequestException("OTP has already been used");
    }

    const isSamePassword = await this.hashService.compare(dto.password, user.password);
    if (isSamePassword) {
      throw new BadRequestException("New password cannot be the same as the current password");
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    await this.databaseService.db
      .update(verificationsTable)
      .set({ used: true })
      .where(eq(verificationsTable.id, verification.id));

    await this.databaseService.db
      .update(usersTable)
      .set({ password: hashedPassword })
      .where(eq(usersTable.id, user.id));

    return {
      message: "Password has been reset successfully"
    };
  }
}
