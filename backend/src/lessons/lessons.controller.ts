import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './create-lesson.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // API: Tạo bài học (Cần đăng nhập)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createLessonDto: CreateLessonDto, @Request() req) {
    return this.lessonsService.create(createLessonDto, req.user);
  }

  // API: Lấy danh sách bài học của 1 khóa
  // URL: GET /lessons/course/:courseId
  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.lessonsService.findByCourse(courseId);
  }

  // API: Xem chi tiết bài học
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }
}
