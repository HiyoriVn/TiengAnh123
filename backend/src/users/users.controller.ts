import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register') // API Route: POST /users/register
  @UsePipes(ValidationPipe) // Kích hoạt kiểm tra dữ liệu theo DTO
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt')) // <--- "Lính gác" chặn cửa
  @Get('profile')
  getProfile(@Request() req) {
    // Nếu qua được lính gác, thông tin user sẽ nằm trong req.user
    return req.user;
  }
}
