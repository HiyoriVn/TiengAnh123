import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username không được để trống' })
  username: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; // Mặc định là STUDENT nếu không gửi lên
}
