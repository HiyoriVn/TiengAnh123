import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course, CourseStatus } from '../entities/course.entity';
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

  // 2. Lấy tất cả khóa học (Chỉ khóa học đã được duyệt)
  async findAll(): Promise<Course[]> {
    return this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.creator', 'creator')
      .where('course.isPublished = :isPublished', { isPublished: true })
      .loadRelationCountAndMap('course.lessonsCount', 'course.lessons')
      .loadRelationCountAndMap('course.enrollmentsCount', 'course.enrollments')
      .orderBy('course.createdAt', 'DESC')
      .getMany();
  }

  // 2.1. Admin lấy TẤT CẢ khóa học (bao gồm cả chưa duyệt)
  async findAllForAdmin(): Promise<Course[]> {
    return this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.creator', 'creator')
      .loadRelationCountAndMap('course.lessonsCount', 'course.lessons')
      .loadRelationCountAndMap('course.enrollmentsCount', 'course.enrollments')
      .orderBy('course.createdAt', 'DESC')
      .getMany();
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

  // 5. Admin duyệt/ẩn khóa học (Chỉ Admin)
  async updateApproval(id: string, isPublished: boolean): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!course) {
      throw new NotFoundException('Không tìm thấy khóa học');
    }

    course.status = isPublished ? CourseStatus.PUBLISHED : CourseStatus.DRAFT;
    course.isPublished = isPublished; // Set isPublished field
    return this.courseRepository.save(course);
  }

  // 6. Xóa khóa học (Chỉ Admin)
  async remove(id: string): Promise<void> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['enrollments', 'lessons'],
    });

    if (!course) {
      throw new NotFoundException('Không tìm thấy khóa học');
    }

    // Kiểm tra xem có học viên đã đăng ký chưa
    if (course.enrollments && course.enrollments.length > 0) {
      throw new ForbiddenException(
        `Không thể xóa khóa học này vì đã có ${course.enrollments.length} học viên đăng ký. Vui lòng ẩn khóa học thay vì xóa.`,
      );
    }

    // Kiểm tra xem có bài học nào chưa
    if (course.lessons && course.lessons.length > 0) {
      throw new ForbiddenException(
        `Không thể xóa khóa học này vì đã có ${course.lessons.length} bài học. Vui lòng xóa tất cả bài học trước hoặc ẩn khóa học.`,
      );
    }

    await this.courseRepository.remove(course);
  }
}
