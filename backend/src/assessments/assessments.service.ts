import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from '../entities/assessment.entity';
import { CreateAssessmentDto } from './create-assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentRepository: Repository<Assessment>,
  ) {}

  // 1. Tạo đề kiểm tra
  async create(dto: CreateAssessmentDto) {
    const assessment = this.assessmentRepository.create({
      title: dto.title,
      type: dto.type as any,
      duration: dto.duration,
      // SỬA Ở ĐÂY: Đổi null thành undefined
      course: dto.courseId ? { id: dto.courseId } : undefined,
    });
    return this.assessmentRepository.save(assessment);
  }
  // 2. Lấy danh sách đề của 1 khóa học
  async findByCourse(courseId: string) {
    return this.assessmentRepository.find({
      where: { course: { id: courseId } },
    });
  }
}
