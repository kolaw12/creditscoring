import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../../database";
import { config } from "../../config";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../../utils/errors";
import { AuthUser } from "../../types";
import { UserRole, UserStatus } from "@prisma/client";

const SALT_ROUNDS = 12;

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

function generateTokens(payload: TokenPayload) {
  const accessToken = jwt.sign(
    { id: payload.userId, email: payload.email, role: payload.role },
    config.jwt.secret,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: payload.userId, type: "refresh" },
    config.jwt.refreshSecret,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

export class AuthService {
  async signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    // Check for existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existingEmail) {
      throw new ConflictError("An account with this email already exists");
    }

    // Check for existing phone
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone },
    });
    if (existingPhone) {
      throw new ConflictError("An account with this phone number already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user with tenant profile
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.tenant,
        status: UserStatus.pending_verification,
        tenantProfile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: refreshExpiry,
      },
    });

    // TODO: Send verification email (Phase 8)

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "create",
        entity: "user",
        entityId: user.id,
      },
    });

    return {
      user,
      ...tokens,
    };
  }

  async login(email: string, password: string, ip?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (user.status === UserStatus.suspended) {
      throw new UnauthorizedError("Account has been suspended");
    }

    if (user.status === UserStatus.deactivated) {
      throw new UnauthorizedError("Account has been deactivated");
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      // Audit failed login
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "failed_login",
          entity: "user",
          entityId: user.id,
          ipAddress: ip,
          userAgent,
        },
      });
      throw new UnauthorizedError("Invalid email or password");
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: refreshExpiry,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "login",
        entity: "user",
        entityId: user.id,
        ipAddress: ip,
        userAgent,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
      ...tokens,
    };
  }

  async refreshToken(token: string) {
    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    // Find and validate refresh token in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.revokedAt) {
      throw new UnauthorizedError("Refresh token has been revoked");
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError("Refresh token has expired");
    }

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    const tokens = generateTokens({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    // Store new refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: storedToken.user.id,
        expiresAt: refreshExpiry,
      },
    });

    return tokens;
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        tenantProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}

export const authService = new AuthService();
