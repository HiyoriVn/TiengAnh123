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
import { UserLessonProgress } from '../entities/user-lesson-progress.entity';
import { GamificationService } from '../gamification/gamification.service';
import { AchievementType } from '../entities/achievement.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(UserLessonProgress)
    private progressRepository: Repository<UserLessonProgress>,
    private gamificationService: GamificationService,
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

  // 2. Lấy danh sách bài học của 1 khóa (Chỉ bài đã được duyệt)
  async findByCourse(courseId: string): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: {
        course: { id: courseId },
        isPublished: true, // Chỉ lấy bài đã duyệt
      },
      order: { orderIndex: 'ASC' }, // Sắp xếp tăng dần theo thứ tự bài
    });
  }

  // 3. Xem chi tiết 1 bài học (Chỉ bài đã được duyệt)
  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: {
        id,
        isPublished: true, // Chỉ lấy bài đã duyệt
      },
    });
    if (!lesson)
      throw new NotFoundException('Bài học không tồn tại hoặc chưa được duyệt');
    return lesson;
  }

  // 4. Update lesson (chỉ creator hoặc admin)
  async update(id: string, updateData: any, user: User): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['course', 'course.creator'],
    });

    if (!lesson) {
      throw new NotFoundException('Bài học không tồn tại');
    }

    // Check quyền: Chỉ creator hoặc admin
    if (lesson.course.creator.id !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài học này');
    }

    // Update fields
    Object.assign(lesson, updateData);

    // Reset approval status nếu có thay đổi content
    if (
      updateData.content ||
      updateData.videoUrl ||
      updateData.audioUrl ||
      updateData.pdfUrl
    ) {
      lesson.approvalStatus = 'PENDING';
    }

    return this.lessonRepository.save(lesson);
  }

  async approveLesson(id: string, status: 'APPROVED' | 'REJECTED') {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Bài học không tồn tại');

    lesson.approvalStatus = status;
    lesson.isPublished = status === 'APPROVED'; // Set isPublished
    return this.lessonRepository.save(lesson);
  }

  // 2. Lấy danh sách bài cần duyệt (PENDING)
  async findPendingLessons() {
    return this.lessonRepository.find({
      where: { approvalStatus: 'PENDING' },
      relations: ['course', 'course.creator'], // Lấy thông tin khóa học và giảng viên để Admin xem
    });
  }

  // Admin: Get all lessons (any status)
  async findAllForAdmin() {
    return this.lessonRepository.find({
      relations: ['course', 'course.creator'],
      order: { orderIndex: 'ASC' },
    });
  }

  // Admin: Update approval status with rejection reason
  async updateApprovalStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    rejectionReason?: string,
  ) {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['course', 'course.creator'],
    });

    if (!lesson) {
      throw new NotFoundException('Bài học không tồn tại');
    }

    lesson.approvalStatus = status;

    // TODO: Send notification to lecturer if rejected
    // You can implement email/notification service here
    if (status === 'REJECTED' && rejectionReason) {
      console.log(
        `Lesson "${lesson.title}" rejected. Reason: ${rejectionReason}`,
      );
      // await this.notificationService.sendRejectionEmail(
      //   lesson.course.creator.email,
      //   lesson.title,
      //   rejectionReason
      // );
    }

    return this.lessonRepository.save(lesson);
  }

  // 🎮 Complete Lesson with Gamification
  async completeLesson(lessonId: string, userId: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['course'],
    });

    if (!lesson) {
      throw new NotFoundException('Bài học không tồn tại');
    }

    // Check if already completed
    let progress = await this.progressRepository.findOne({
      where: {
        user: { id: userId },
        lesson: { id: lessonId },
      },
    });

    if (progress && progress.completed) {
      return { message: 'Bài học đã hoàn thành trước đó', progress };
    }

    // Mark as completed
    if (!progress) {
      progress = this.progressRepository.create({
        user: { id: userId },
        lesson: { id: lessonId },
        completed: true,
      });
    } else {
      progress.completed = true;
    }

    await this.progressRepository.save(progress);

    // 🎮 Gamification: Award points and check achievements
    try {
      // 1. Award base points
      await this.gamificationService.awardPoints(
        userId,
        10,
        'Hoàn thành bài học',
      );

      // 2. Update streak
      await this.gamificationService.updateStreak(userId);

      // 3. Check lesson count achievements
      const completedCount = await this.progressRepository.count({
        where: {
          user: { id: userId },
          completed: true,
        },
      });

      if (completedCount === 1) {
        await this.gamificationService.unlockAchievement(
          userId,
          AchievementType.FIRST_LESSON,
        );
      } else if (completedCount === 5) {
        await this.gamificationService.unlockAchievement(
          userId,
          AchievementType.COMPLETE_5_LESSONS,
        );
      } else if (completedCount === 10) {
        await this.gamificationService.unlockAchievement(
          userId,
          AchievementType.COMPLETE_10_LESSONS,
        );
      }

      // 4. Check if course is completed (all lessons done)
      const courseLessonsCount = await this.lessonRepository.count({
        where: { course: { id: lesson.course.id } },
      });

      const completedCourseLessons = await this.progressRepository.count({
        where: {
          user: { id: userId },
          lesson: { course: { id: lesson.course.id } },
          completed: true,
        },
        relations: ['lesson', 'lesson.course'],
      });

      if (completedCourseLessons === courseLessonsCount) {
        await this.gamificationService.unlockAchievement(
          userId,
          AchievementType.COMPLETE_COURSE,
        );
      }
    } catch (error) {
      console.error('Error awarding gamification points:', error);
      // Don't fail the completion if gamification fails
    }

    return {
      message: 'Hoàn thành bài học thành công',
      progress,
    };
  }

  // Get user progress for a lesson
  async getUserProgress(lessonId: string, userId: string) {
    return this.progressRepository.findOne({
      where: {
        user: { id: userId },
        lesson: { id: lessonId },
      },
    });
  }
}
