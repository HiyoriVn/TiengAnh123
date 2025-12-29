import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PlacementTest,
  PlacementTestStatus,
} from '../entities/placement-test.entity';
import {
  PlacementQuestion,
  QuestionType,
} from '../entities/placement-question.entity';
import { UserPlacementResult } from '../entities/user-placement-result.entity';
import { User } from '../entities/user.entity';
import { CourseLevel } from '../entities/course.entity';
import { CreatePlacementTestDto } from './create-placement-test.dto';
import { SubmitPlacementTestDto } from './submit-placement-test.dto';
import { UpdatePlacementTestStatusDto } from './update-placement-test.dto';

@Injectable()
export class PlacementTestService {
  constructor(
    @InjectRepository(PlacementTest)
    private placementTestRepository: Repository<PlacementTest>,
    @InjectRepository(PlacementQuestion)
    private placementQuestionRepository: Repository<PlacementQuestion>,
    @InjectRepository(UserPlacementResult)
    private userPlacementResultRepository: Repository<UserPlacementResult>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ==================== LECTURER METHODS ====================

  async createTest(createDto: CreatePlacementTestDto): Promise<PlacementTest> {
    const test = this.placementTestRepository.create({
      title: createDto.title,
      description: createDto.description,
      duration: createDto.duration,
      totalQuestions: createDto.totalQuestions,
      status: PlacementTestStatus.DRAFT,
    });

    const savedTest = await this.placementTestRepository.save(test);

    // Create questions
    const questions = createDto.questions.map((q) =>
      this.placementQuestionRepository.create({
        ...q,
        test: savedTest,
      }),
    );

    await this.placementQuestionRepository.save(questions);

    const result = await this.placementTestRepository.findOne({
      where: { id: savedTest.id },
      relations: ['questions'],
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy bài test vừa tạo');
    }

    return result;
  }

  async updateTestStatus(
    testId: string,
    updateDto: UpdatePlacementTestStatusDto,
  ): Promise<PlacementTest> {
    const test = await this.placementTestRepository.findOne({
      where: { id: testId },
    });

    if (!test) {
      throw new NotFoundException('Không tìm thấy bài kiểm tra');
    }

    // If setting to ACTIVE, deactivate all other tests
    if (updateDto.status === PlacementTestStatus.ACTIVE) {
      await this.placementTestRepository.update(
        { status: PlacementTestStatus.ACTIVE },
        { status: PlacementTestStatus.ARCHIVED },
      );
    }

    test.status = updateDto.status;
    return this.placementTestRepository.save(test);
  }

  async getAllTests(): Promise<PlacementTest[]> {
    return this.placementTestRepository.find({
      relations: ['questions'],
      order: { createdAt: 'DESC' },
    });
  }

  async allowRetake(resultId: string): Promise<UserPlacementResult> {
    const result = await this.userPlacementResultRepository.findOne({
      where: { id: resultId },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy kết quả');
    }

    result.canRetake = true;
    return this.userPlacementResultRepository.save(result);
  }

  // ==================== STUDENT METHODS ====================

  async getActiveTest(): Promise<PlacementTest> {
    const test = await this.placementTestRepository.findOne({
      where: { status: PlacementTestStatus.ACTIVE },
      relations: ['questions'],
      order: { createdAt: 'DESC' },
    });

    if (!test) {
      throw new NotFoundException(
        'Hiện tại chưa có bài kiểm tra đánh giá trình độ',
      );
    }

    // Sort questions by order
    test.questions.sort((a, b) => a.order - b.order);

    return test;
  }

  async checkUserCanTakeTest(userId: string): Promise<{
    canTake: boolean;
    message?: string;
    lastResult?: UserPlacementResult;
  }> {
    const activeTest = await this.getActiveTest();

    const lastResult = await this.userPlacementResultRepository.findOne({
      where: {
        user: { id: userId },
        test: { id: activeTest.id },
      },
      order: { completedAt: 'DESC' },
    });

    if (!lastResult) {
      return { canTake: true };
    }

    if (lastResult.canRetake) {
      return { canTake: true, lastResult };
    }

    return {
      canTake: false,
      message:
        'Bạn đã hoàn thành bài kiểm tra này. Vui lòng liên hệ giảng viên để làm lại.',
      lastResult,
    };
  }

  async submitTest(
    userId: string,
    submitDto: SubmitPlacementTestDto,
  ): Promise<UserPlacementResult> {
    const test = await this.placementTestRepository.findOne({
      where: { id: submitDto.testId },
      relations: ['questions'],
    });

    if (!test) {
      throw new NotFoundException('Không tìm thấy bài kiểm tra');
    }

    // Check if user can take test
    const canTake = await this.checkUserCanTakeTest(userId);
    if (!canTake.canTake) {
      throw new ForbiddenException(canTake.message);
    }

    // Fetch user entity
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Grade the test
    const { score, totalPoints, skillBreakdown } = this.gradeTest(
      test.questions,
      submitDto.answers,
    );

    const percentage = (score / totalPoints) * 100;
    const level = this.calculateLevel(percentage);

    // Save result
    const result = this.userPlacementResultRepository.create({
      user,
      test,
      score,
      totalPoints,
      percentage,
      level,
      answers: submitDto.answers,
      skillBreakdown,
      timeTaken: submitDto.timeTaken,
      canRetake: false,
    });

    return this.userPlacementResultRepository.save(result);
  }

  async getUserResult(userId: string): Promise<UserPlacementResult | null> {
    const activeTest = await this.getActiveTest();

    return this.userPlacementResultRepository.findOne({
      where: {
        user: { id: userId },
        test: { id: activeTest.id },
      },
      relations: ['test'],
      order: { completedAt: 'DESC' },
    });
  }

  // ==================== HELPER METHODS ====================

  private gradeTest(
    questions: PlacementQuestion[],
    userAnswers: Record<string, string>,
  ): {
    score: number;
    totalPoints: number;
    skillBreakdown: Record<string, number>;
  } {
    let score = 0;
    let totalPoints = 0;
    const skillScores: Record<string, { correct: number; total: number }> = {};

    questions.forEach((question) => {
      totalPoints += question.points;

      const skill = question.skill;
      if (!skillScores[skill]) {
        skillScores[skill] = { correct: 0, total: 0 };
      }
      skillScores[skill].total += question.points;

      const userAnswer = userAnswers[question.id];
      if (this.isCorrectAnswer(question, userAnswer)) {
        score += question.points;
        skillScores[skill].correct += question.points;
      }
    });

    // Calculate percentage for each skill
    const skillBreakdown: Record<string, number> = {};
    Object.keys(skillScores).forEach((skill) => {
      const { correct, total } = skillScores[skill];
      skillBreakdown[skill] = Math.round((correct / total) * 100);
    });

    return { score, totalPoints, skillBreakdown };
  }

  private isCorrectAnswer(
    question: PlacementQuestion,
    userAnswer: string,
  ): boolean {
    if (!userAnswer) return false;

    const correctAnswer = question.correctAnswer;

    switch (question.questionType) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.TRUE_FALSE:
        // Case-insensitive comparison
        const correctStr =
          typeof correctAnswer === 'string'
            ? correctAnswer
            : JSON.stringify(correctAnswer);
        return (
          userAnswer.toLowerCase().trim() === correctStr.toLowerCase().trim()
        );

      case QuestionType.FILL_BLANK:
        // Case-insensitive, trim whitespace
        const correctFillStr =
          typeof correctAnswer === 'string'
            ? correctAnswer
            : JSON.stringify(correctAnswer);
        return (
          userAnswer.toLowerCase().trim() ===
          correctFillStr.toLowerCase().trim()
        );

      case QuestionType.MATCHING:
        // Compare JSON objects
        try {
          const userObj = JSON.parse(userAnswer);
          return JSON.stringify(userObj) === JSON.stringify(correctAnswer);
        } catch {
          return false;
        }

      case QuestionType.REWRITE:
        // For rewrite, we'll do simple comparison
        // In production, this might need AI grading
        const correctRewriteStr =
          typeof correctAnswer === 'string'
            ? correctAnswer
            : JSON.stringify(correctAnswer);
        return (
          userAnswer.toLowerCase().trim() ===
          correctRewriteStr.toLowerCase().trim()
        );

      default:
        return false;
    }
  }

  private calculateLevel(percentage: number): CourseLevel {
    if (percentage >= 91) return CourseLevel.C2;
    if (percentage >= 81) return CourseLevel.C1;
    if (percentage >= 66) return CourseLevel.B2;
    if (percentage >= 51) return CourseLevel.B1;
    if (percentage >= 31) return CourseLevel.A2;
    return CourseLevel.A1;
  }
}
