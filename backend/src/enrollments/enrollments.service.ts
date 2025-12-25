import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { Course } from '../entities/course.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  // 1. Đăng ký khóa học
  async create(userId: string, courseId: string): Promise<Enrollment> {
    // Check khóa học
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Khóa học không tồn tại');

    // Check đã đăng ký chưa
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
    });
    if (existingEnrollment) {
      throw new ConflictException('Bạn đã đăng ký khóa học này rồi');
    }

    // Lưu DB
    const newEnrollment = this.enrollmentRepository.create({
      user: { id: userId } as User, // Hack nhẹ kiểu dữ liệu để đỡ phải query User
      course: course,
    });
    return this.enrollmentRepository.save(newEnrollment);
  }

  // 2. Kiểm tra xem user đã đăng ký khóa này chưa (Dùng cho Frontend check nút bấm)
  async checkEnrollment(
    userId: string,
    courseId: string,
  ): Promise<{ enrolled: boolean }> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
    });
    return { enrolled: !!enrollment };
  }

  // 3. Lấy danh sách khóa học CỦA TÔI
  async findMyCourses(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { user: { id: userId } },
      relations: ['course'], // Lấy kèm thông tin khóa học
      order: { enrolledAt: 'DESC' },
    });
  }
}
