import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req) {
    // req.username và req.password gửi từ Frontend lên
    const user = await this.authService.validateUser(
      req.username,
      req.password,
    );

    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    return this.authService.login(user);
  }
}
