import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async register(input: RegisterInput, res: Response) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
      },
    });

    await this.generateTokens(user.id, user.role, res);

    return user;
  }

  async login(input: LoginInput, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) throw new UnauthorizedException('Email atau password salah');

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Email atau password salah');

    await this.generateTokens(user.id, user.role, res);

    return { user };
  }

  async logout(userId: string, res: Response) {
    await this.redis.del(`refresh_token:${userId}`);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('user_id');

    return true;
  }

  async refresh(userId: string, refreshToken: string, res: Response) {
    const storedToken = await this.redis.get(`refresh_token:${userId}`);

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User tidak ditemukan');
      }

      await this.generateTokens(user.id, user.role, res);

      return { user };
    } catch {
      await this.redis.del(`refresh_token:${userId}`);
      throw new UnauthorizedException(
        'Refresh token kadaluarsa atau tidak valid',
      );
    }
  }

  private async generateTokens(userId: string, role: string, res: Response) {
    const payload = { sub: userId, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_SECRET'),
    });

    await this.redis.set(
      `refresh_token:${userId}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60,
    );

    const isProd = this.configService.get('NODE_ENV') === 'production';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('user_id', userId, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
