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

  // API: Xem chi tiết (Ai cũng xem được)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
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
}
