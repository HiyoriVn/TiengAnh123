import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity'; // Import Entity User

@Module({
  imports: [TypeOrmModule.forFeature([User])], // <--- Đăng ký Repository User
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export để sau này Module Auth dùng
})
export class UsersModule {}
