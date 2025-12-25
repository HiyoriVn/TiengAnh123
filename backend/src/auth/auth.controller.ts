import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'; // <--- Import AuthGuard

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  // API NÀY CẦN CÓ CHÌA KHÓA MỚI VÀO ĐƯỢC
  @UseGuards(AuthGuard('jwt')) // <--- Lắp ổ khóa 'jwt' vào đây
  @Get('profile')
  getProfile(@Request() req: any) {
    // Nếu vào được đến đây nghĩa là Token xịn.
    // NestJS đã tự động gắn thông tin user vào biến req.user
    return req.user;
  }
}
