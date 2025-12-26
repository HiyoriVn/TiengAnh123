import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  // 1. HỌC VIÊN: Nộp bài
  async submitWork(student: User, assessmentId: string, fileUrl: string) {
    // Check xem đã nộp chưa (nếu muốn chặn nộp nhiều lần)
    // Ở đây ta cho phép nộp đè hoặc nộp mới tùy logic, ta làm đơn giản là tạo mới
    const submission = this.submissionRepository.create({
      student: student,
      assessment: { id: assessmentId },
      fileWork: fileUrl,
      status: 'SUBMITTED',
    });
    return this.submissionRepository.save(submission);
  }

  // 2. GIẢNG VIÊN: Lấy danh sách bài nộp theo đề thi
  async findAllByAssessment(assessmentId: string) {
    return this.submissionRepository.find({
      where: { assessment: { id: assessmentId } },
      relations: ['student'], // Để hiện tên sinh viên
      order: { submitDate: 'DESC' },
    });
  }

  // 3. GIẢNG VIÊN: Chấm điểm
  async gradeWork(
    submissionId: string,
    score: number,
    comment: string,
    lecturer: User,
  ) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
    });
    if (!submission) throw new NotFoundException('Bài nộp không tồn tại');

    submission.score = score;
    submission.comment = comment;
    submission.status = 'GRADED'; // Đổi trạng thái đã chấm
    submission.gradedBy = lecturer; // Lưu người chấm

    return this.submissionRepository.save(submission);
  }
}
