import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('enrollments')
@UseGuards(AuthGuard('jwt')) // Toàn bộ API này đều cần đăng nhập
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // API: Đăng ký khóa học
  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @Request() req) {
    return this.enrollmentsService.create(
      req.user.id,
      createEnrollmentDto.courseId,
    );
  }

  // API: Lấy danh sách khóa học đã đăng ký
  @Get('my-courses')
  findMyCourses(@Request() req) {
    return this.enrollmentsService.findMyCourses(req.user.id);
  }

  // API Check trạng thái (để UI hiển thị nút "Đăng ký" hay "Vào học")
  @Get('check/:courseId')
  checkEnrollment(@Param('courseId') courseId: string, @Request() req) {
    return this.enrollmentsService.checkEnrollment(req.user.id, courseId);
  }
}
