import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // 1. Tạo "muối" (salt) để làm mật khẩu khó đoán hơn
      const saltOrRounds = 10;

      // 2. Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );

      // 3. Tạo user mới với mật khẩu ĐÃ MÃ HÓA
      const newUser = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword, // Thay password gốc bằng hash
      });

      // 4. Lưu vào DB
      return await this.usersRepository.save(newUser);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException(
          'Email này đã tồn tại! Vui lòng chọn email khác.',
        );
      }
      throw error;
    }
  }

  // Hàm lấy danh sách user
  async findAll() {
    return await this.usersRepository.find();
  }

  // Hàm tìm 1 user theo ID
  async findOne(id: string) {
    // Lưu ý: ID của mình là string (UUID)
    return await this.usersRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  // Hàm tìm user theo email (Dùng cho chức năng đăng nhập)
  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}
