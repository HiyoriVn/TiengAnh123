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
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './create-exercise.dto';
import { SubmitExerciseDto } from './submit-exercise.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  // 1. Giảng viên tạo bài tập
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateExerciseDto, @Request() req) {
    return this.exercisesService.create(dto, req.user);
  }

  // 2. Lấy danh sách bài tập theo lesson
  @Get('lesson/:lessonId')
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.exercisesService.findByLesson(lessonId);
  }

  // 3. Lấy chi tiết bài tập
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  // 4. Nộp bài và chấm điểm
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @Body() dto: SubmitExerciseDto,
    @Request() req,
    @Query('timeSpent') timeSpent?: number,
  ) {
    return this.exercisesService.submit(id, dto, req.user, timeSpent);
  }

  // 5. Lấy kết quả của user
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/result')
  getUserResult(@Param('id') id: string, @Request() req) {
    return this.exercisesService.getUserResult(id, req.user.id);
  }

  // 6. Lấy lịch sử làm bài
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/history')
  getUserHistory(@Param('id') id: string, @Request() req) {
    return this.exercisesService.getUserHistory(id, req.user.id);
  }
}
