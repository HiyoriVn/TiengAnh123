import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from '../entities/lesson.entity';
import { Course } from '../entities/course.entity'; // Import thêm Course

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Course])], // Đăng ký cả 2
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
