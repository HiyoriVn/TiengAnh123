import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from '../entities/course.entity'; // Import Entity

@Module({
  imports: [TypeOrmModule.forFeature([Course])], // <--- Đăng ký Entity
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
