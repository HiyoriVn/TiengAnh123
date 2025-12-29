import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  Put,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './create-lesson.dto';
import { UpdateLessonDto } from './update-lesson.dto';
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

  // API: Lấy danh sách bài chờ duyệt (Chỉ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('pending/all')
  findPending() {
    return this.lessonsService.findPendingLessons();
  }

  // API: Admin lấy tất cả lessons
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('admin/all')
  findAllForAdmin() {
    return this.lessonsService.findAllForAdmin();
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

  // API: Update lesson (Lecturer hoặc Admin)
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @Request() req,
  ) {
    return this.lessonsService.update(id, updateLessonDto, req.user);
  }

  // API: Duyệt bài (Chỉ Admin) - URL cũ
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/approve')
  approve(
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
  ) {
    return this.lessonsService.approveLesson(id, status);
  }

  // API: Duyệt bài (Chỉ Admin) - URL mới
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/approval')
  updateApproval(
    @Param('id') id: string,
    @Body()
    body: { approvalStatus: 'APPROVED' | 'REJECTED'; rejectionReason?: string },
  ) {
    return this.lessonsService.updateApprovalStatus(
      id,
      body.approvalStatus,
      body.rejectionReason,
    );
  }

  // 🎮 API: Complete Lesson (Student)
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/complete')
  completeLesson(@Param('id') id: string, @Request() req) {
    return this.lessonsService.completeLesson(id, req.user.id);
  }

  // API: Get user progress for lesson
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/progress')
  getUserProgress(@Param('id') id: string, @Request() req) {
    return this.lessonsService.getUserProgress(id, req.user.id);
  }
}
