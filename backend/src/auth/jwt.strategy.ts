import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Lấy token từ Header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Từ chối nếu token hết hạn
      secretOrKey: 'SECRET_KEY_CUA_BAN', // QUAN TRỌNG: Phải khớp với bên auth.module.ts
    });
  }

  // Khi token hợp lệ, hàm này sẽ chạy
  async validate(payload: any) {
    // Trả về thông tin user, NestJS sẽ tự gán nó vào object `req.user`
    return Promise.resolve({
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    });
  }
}
