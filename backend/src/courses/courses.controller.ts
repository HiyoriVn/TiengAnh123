import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './create-course.dto';
import { UpdateCourseDto } from './update-course.dto';
import { AuthGuard } from '@nestjs/passport'; // Lính gác
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // API: Tạo khóa học (Yêu cầu đăng nhập)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    // req.user được lấy từ Token (do JwtStrategy giải mã)
    return this.coursesService.create(createCourseDto, req.user);
  }

  // API: Xem tất cả khóa học (Ai cũng xem được -> Không cần Guard)
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  // API: Admin xem tất cả khóa học (Bao gồm cả chưa duyệt)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('/admin/all')
  findAllForAdmin() {
    return this.coursesService.findAllForAdmin();
  }

  // API: Xem khóa học của giảng viên hiện tại (Yêu cầu đăng nhập)
  @UseGuards(AuthGuard('jwt'))
  @Get('/my-courses')
  findMyCourses(@Request() req) {
    return this.coursesService.findByCreator(req.user.id);
  }

  // API: Xem chi tiết (Ai cũng xem được)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  // API: Admin duyệt/ẩn khóa học (Chỉ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/approval')
  updateApproval(
    @Param('id') id: string,
    @Body('isPublished') isPublished: boolean,
  ) {
    return this.coursesService.updateApproval(id, isPublished);
  }

  // API: Sửa khóa học (Yêu cầu đăng nhập & Chính chủ)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Request() req,
  ) {
    return this.coursesService.update(id, updateCourseDto, req.user);
  }

  // API: Xóa khóa học (Chỉ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.coursesService.remove(id);
    return { message: 'Xóa khóa học thành công' };
  }
}
