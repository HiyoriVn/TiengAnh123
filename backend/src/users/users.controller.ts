import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Put, Query } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';

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
  // API 1: Lấy danh sách user (Chỉ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Kích hoạt cả 2 lính gác
  @Roles('ADMIN') // Chỉ cho Admin vào
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // API 2: Khóa/Mở khóa user (Chỉ Admin)
  // URL: PATCH /users/:id/status
  // Body: { "status": "LOCKED" } hoặc "ACTIVE"
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'LOCKED',
  ) {
    return this.usersService.updateStatus(id, status);
  }

  // API: Đổi role user (Chỉ Admin)
  // URL: PATCH /users/:id/role
  // Body: { "role": "STUDENT" | "LECTURER" | "ADMIN" }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.usersService.updateRole(id, role);
  }

  // API 3: Update user info (Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    return this.usersService.updateUser(id, updateData);
  }

  // API 4: Delete user (Admin, soft delete)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
