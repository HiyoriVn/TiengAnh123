import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, email, fullName, role } = createUserDto;

    // 1. Tạo "muối" (salt) để mã hóa password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Tạo đối tượng User mới
    const user = this.usersRepository.create({
      username,
      password: hashedPassword, // Lưu pass đã mã hóa
      email,
      fullName,
      role,
    });

    try {
      // 3. Lưu vào DB
      return await this.usersRepository.save(user);
    } catch (error) {
      // Kiểm tra lỗi trùng lặp (Postgres error code 23505 là duplicate key)
      if (error.code === '23505') {
        throw new ConflictException('Username hoặc Email đã tồn tại');
      }
      throw new InternalServerErrorException();
    }
  }
  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }
  // 1. Lấy danh sách tất cả user (Trừ password)
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // 2. Cập nhật trạng thái (Khóa / Mở khóa)
  async updateStatus(id: string, status: 'ACTIVE' | 'LOCKED'): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    user.status = status;
    return this.usersRepository.save(user);
  }
}
