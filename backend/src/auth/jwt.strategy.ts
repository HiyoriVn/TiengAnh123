import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ Header "Authorization: Bearer ..."
      ignoreExpiration: false, // Nếu token hết hạn thì từ chối ngay
      secretOrKey: '123456', // <--- QUAN TRỌNG: Phải khớp với secret bên auth.module.ts
    });
  }

  // Nếu Token hợp lệ, hàm này sẽ chạy và trả về thông tin user
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.username, role: payload.role };
  }
}
