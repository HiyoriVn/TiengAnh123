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

  async signIn(email: string, pass: string): Promise<any> {
    // 1. Tìm user theo email
    const user = await this.usersService.findOneByEmail(email);

    // 2. Nếu không thấy user -> Báo lỗi
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }

    // 3. So sánh mật khẩu (pass nhập vào vs pass đã mã hóa trong DB)
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu sai');
    }

    // 4. Nếu đúng hết -> Tạo Token
    const payload = { sub: user.id, username: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
