import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './create-lesson.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

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
  // API: Lấy danh sách bài chờ duyệt (Chỉ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('pending/all')
  findPending() {
    return this.lessonsService.findPendingLessons();
  }

  // API: Duyệt bài (Chỉ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/approve')
  approve(
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.lessonsService.approveLesson(id, status);
  }
}
