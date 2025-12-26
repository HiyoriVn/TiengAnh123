import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu API không yêu cầu quyền gì đặc biệt -> Cho qua
    if (!requiredRoles) {
      return true;
    }

    // Lấy thông tin user từ request (đã được JwtStrategy giải mã)
    const { user } = context.switchToHttp().getRequest();

    // Kiểm tra xem role của user có nằm trong danh sách cho phép không
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Bạn không có quyền truy cập chức năng này');
    }

    return true;
  }
}
