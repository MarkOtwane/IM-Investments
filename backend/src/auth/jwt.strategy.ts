import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Validating payload:', payload);
    
    // Verify user still exists
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      console.log('JWT Strategy - User not found for ID:', payload.sub);
      throw new UnauthorizedException('User not found');
    }

    console.log('JWT Strategy - User found:', { id: user.id, email: user.email, role: user.role });
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}