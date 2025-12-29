import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from './email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from '../users/create-user.dto';
import { User } from '../entities/user.entity';

interface UserWithoutPassword {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  avatar?: string;
  points?: number;
  streak?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // Hàm 0: Đăng ký tài khoản mới
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    // Tự động đăng nhập sau khi đăng ký
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar || null,
      },
    };
  }

  // Hàm 1: Kiểm tra tài khoản mật khẩu
  async validateUser(
    identifier: string,
    pass: string,
  ): Promise<UserWithoutPassword | null> {
    // Tìm user theo email HOẶC username
    const user = await this.usersService.findByEmailOrUsername(identifier);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // Nếu pass khớp, trả về thông tin user (trừ password)
      const { password, ...result } = user;
      return result as UserWithoutPassword;
    }
    return null;
  }

  // Hàm 2: Đăng nhập và tạo Token
  async login(user: UserWithoutPassword) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload), // Tạo token từ payload
      user: {
        // Trả thêm thông tin cơ bản để Frontend hiển thị
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar || null,
      },
    };
  }

  // Hàm 3: Quên mật khẩu - Gửi email reset
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Email không tồn tại trong hệ thống');
    }

    // Tạo token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Lưu token và thời gian hết hạn (1 giờ)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.usersService.save(user);

    // Gửi email
    try {
      await this.emailService.sendResetPasswordEmail(
        email,
        resetToken,
        user.fullName,
      );
    } catch (error) {
      console.error('Failed to send reset password email:', error);
      throw new BadRequestException(
        'Không thể gửi email. Vui lòng kiểm tra cấu hình SMTP hoặc thử lại sau.',
      );
    }

    return {
      message: 'Email khôi phục mật khẩu đã được gửi',
      success: true,
    };
  }

  // Hàm 4: Reset mật khẩu qua token
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    // Hash token để so sánh với DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await this.usersService.findByResetToken(hashedToken);

    if (
      !user ||
      !user.resetPasswordExpiry ||
      user.resetPasswordExpiry < new Date()
    ) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await this.usersService.save(user);

    return {
      message: 'Mật khẩu đã được đặt lại thành công',
      success: true,
    };
  }

  // Hàm 5: Đổi mật khẩu khi đã đăng nhập
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    // Hash và lưu mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.usersService.save(user);

    return {
      message: 'Mật khẩu đã được thay đổi thành công',
      success: true,
    };
  }
}
