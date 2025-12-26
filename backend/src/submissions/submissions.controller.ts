import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('submissions')
@UseGuards(AuthGuard('jwt')) // Bắt buộc đăng nhập
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // API 1: Học viên nộp bài
  // Body gửi lên: { "assessmentId": "...", "fileUrl": "http://..." }
  @Post()
  submit(
    @Body() body: { assessmentId: string; fileUrl: string },
    @Request() req,
  ) {
    return this.submissionsService.submitWork(
      req.user,
      body.assessmentId,
      body.fileUrl,
    );
  }

  // API 2: Giảng viên xem danh sách bài nộp của 1 đề
  @Get('assessment/:id')
  findAllByAssessment(@Param('id') id: string) {
    return this.submissionsService.findAllByAssessment(id);
  }

  // API 3: Giảng viên chấm điểm (US08)
  @Patch(':id/grade')
  grade(
    @Param('id') id: string,
    @Body() body: { score: number; comment: string },
    @Request() req,
  ) {
    return this.submissionsService.gradeWork(
      id,
      body.score,
      body.comment,
      req.user,
    );
  }
}
