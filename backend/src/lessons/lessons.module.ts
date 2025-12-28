import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from '../entities/lesson.entity';
import { Course } from '../entities/course.entity'; // Import thêm Course
import { UserLessonProgress } from '../entities/user-lesson-progress.entity';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Course, UserLessonProgress]),
    GamificationModule,
  ], // Đăng ký cả 2
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
