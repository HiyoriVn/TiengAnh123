import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/lesson.entity';
import { Course } from '../entities/course.entity';
import { CreateLessonDto } from './create-lesson.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  // 1. Tạo bài học mới
  async create(createLessonDto: CreateLessonDto, user: User): Promise<Lesson> {
    const { courseId, ...lessonData } = createLessonDto;

    // Tìm khóa học để kiểm tra quyền sở hữu
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['creator'],
    });

    if (!course) {
      throw new NotFoundException('Khóa học không tồn tại');
    }

    // Check quyền: Chỉ chủ nhân mới được thêm bài
    if (course.creator.id !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền thêm bài vào khóa học này',
      );
    }

    // Tạo bài học
    const newLesson = this.lessonRepository.create({
      ...lessonData,
      course: course, // Link bài học với khóa học
    });

    return this.lessonRepository.save(newLesson);
  }

  // 2. Lấy danh sách bài học của 1 khóa (Sắp xếp theo thứ tự)
  async findByCourse(courseId: string): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: { course: { id: courseId } },
      order: { orderIndex: 'ASC' }, // Sắp xếp tăng dần theo thứ tự bài
    });
  }

  // 3. Xem chi tiết 1 bài học
  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Bài học không tồn tại');
    return lesson;
  }
  async approveLesson(id: string, status: 'APPROVED' | 'REJECTED') {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Bài học không tồn tại');

    lesson.approvalStatus = status;
    return this.lessonRepository.save(lesson);
  }

  // 2. Lấy danh sách bài cần duyệt (PENDING)
  async findPendingLessons() {
    return this.lessonRepository.find({
      where: { approvalStatus: 'PENDING' },
      relations: ['course', 'course.creator'], // Lấy thông tin khóa học và giảng viên để Admin xem
    });
  }
}
