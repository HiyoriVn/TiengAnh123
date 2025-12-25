import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Hàm 1: Kiểm tra tài khoản mật khẩu
  async validateUser(username: string, pass: string): Promise<any> {
    // Tìm user trong DB (bạn cần quay lại UsersService viết thêm hàm findOneByUsername nhé, xem Bước 4.1 bên dưới)
    const user = await this.usersService.findOneByUsername(username);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // Nếu pass khớp, trả về thông tin user (trừ password)
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Hàm 2: Đăng nhập và tạo Token
  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload), // Tạo token từ payload
      user: {
        // Trả thêm thông tin cơ bản để Frontend hiển thị
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }
}
