import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { User } from '../entities/user.entity';
import { GamificationService } from '../gamification/gamification.service';
import { AchievementType } from '../entities/achievement.entity';

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    private gamificationService: GamificationService,
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
      relations: ['student'],
    });
    if (!submission) throw new NotFoundException('Bài nộp không tồn tại');

    submission.score = score;
    submission.comment = comment;
    submission.status = 'GRADED'; // Đổi trạng thái đã chấm
    submission.gradedBy = lecturer; // Lưu người chấm

    const savedSubmission = await this.submissionRepository.save(submission);

    // 🎮 Gamification: Award points based on score
    try {
      if (score >= 70) {
        // Pass score
        const points = Math.round(score / 5); // 70-100 -> 14-20 points
        await this.gamificationService.awardPoints(
          submission.student.id,
          points,
          'Hoàn thành bài nộp',
        );

        // Bonus for perfect score
        if (score === 100) {
          await this.gamificationService.awardPoints(
            submission.student.id,
            10,
            'Điểm tuyệt đối',
          );
          await this.gamificationService.unlockAchievement(
            submission.student.id,
            AchievementType.PERFECT_EXERCISE,
          );
        }

        await this.gamificationService.updateStreak(submission.student.id);
      }
    } catch (error) {
      this.logger.error(
        `Error awarding points for submission ${submissionId}: ${error.message}`,
        error.stack,
      );
    }

    return savedSubmission;
  }
}
