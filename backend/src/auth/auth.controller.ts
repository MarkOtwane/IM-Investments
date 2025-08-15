import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/pass-word-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    console.log('AuthController: Login attempt for:', loginDto.email);
    return this.authService.login(loginDto);
  }

  @Post('password-reset')
  requestPasswordReset(
    @Body(ValidationPipe) passwordResetDto: PasswordResetDto,
  ) {
    return this.authService.requestPasswordReset(passwordResetDto);
  }
}
