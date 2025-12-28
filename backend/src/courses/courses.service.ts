import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { User } from '../entities/user.entity';
import { CreateCourseDto } from './create-course.dto';
import { UpdateCourseDto } from './update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  // 1. Tạo khóa học (Cần biết User nào tạo)
  async create(createCourseDto: CreateCourseDto, user: User): Promise<Course> {
    const newCourse = this.courseRepository.create({
      ...createCourseDto,
      creator: user, // Gán người tạo
    });
    return this.courseRepository.save(newCourse);
  }

  // 2. Lấy tất cả khóa học (Có thể dùng cho trang chủ)
  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['creator', 'lessons', 'enrollments'], // Lấy kèm thông tin người tạo và thống kê
      order: { createdAt: 'DESC' },
    });
  }

  // 2.5. Lấy khóa học của giảng viên cụ thể
  async findByCreator(creatorId: string): Promise<Course[]> {
    return this.courseRepository.find({
      where: { creator: { id: creatorId } },
      relations: ['creator', 'lessons', 'enrollments'],
      order: { createdAt: 'DESC' },
    });
  }

  // 3. Lấy chi tiết 1 khóa học
  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['creator', 'lessons'], // Lấy kèm bài học
    });
    if (!course) throw new NotFoundException('Không tìm thấy khóa học');
    return course;
  }

  // 4. Cập nhật khóa học (Chỉ người tạo mới được sửa)
  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    user: User,
  ): Promise<Course> {
    const course = await this.findOne(id);

    // Kiểm tra quyền: ID người tạo trong DB phải trùng với ID user đang đăng nhập
    if (course.creator.id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa khóa học này');
    }

    Object.assign(course, updateCourseDto); // Update các trường mới
    return this.courseRepository.save(course);
  }
}
