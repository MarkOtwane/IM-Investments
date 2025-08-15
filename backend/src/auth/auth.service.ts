/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/pass-word-reset.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password } = dto;

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with default role CUSTOMER
    const user = await this.prisma.user.create({
      data: {
        email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    // Find user
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    console.log('AuthService - Login payload:', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async requestPasswordReset(dto: PasswordResetDto) {
    const { email } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return; // Silently fail
    }

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

    await this.prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiresAt: expiresAt },
    });

    await this.mailerService.sendPasswordResetEmail(email, resetToken);

    return { message: 'Password reset email sent' };
  }
}

// npm install bcrypt

// npm install --save

// npm install uuid

// npm install --save-
