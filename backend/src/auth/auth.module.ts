import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // Nhập UsersModule để dùng được UsersService
    JwtModule.register({
      global: true,
      secret: '123456', // BÍ MẬT: Sau này sẽ để trong file .env, giờ cứ để tạm
      signOptions: { expiresIn: '1h' }, // Token hết hạn sau 1 giờ
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
