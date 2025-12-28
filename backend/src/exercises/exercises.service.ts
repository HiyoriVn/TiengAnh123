import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../entities/exercise.entity';
import { ExerciseQuestion } from '../entities/exercise-question.entity';
import { ExerciseResult } from '../entities/exercise-result.entity';
import { Lesson } from '../entities/lesson.entity';
import { User } from '../entities/user.entity';
import { CreateExerciseDto } from './create-exercise.dto';
import { SubmitExerciseDto } from './submit-exercise.dto';
import { GamificationService } from '../gamification/gamification.service';
import { AchievementType } from '../entities/achievement.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(ExerciseQuestion)
    private questionRepository: Repository<ExerciseQuestion>,
    @InjectRepository(ExerciseResult)
    private resultRepository: Repository<ExerciseResult>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    private gamificationService: GamificationService,
  ) {}

  // 1. Giảng viên tạo bài tập
  async create(dto: CreateExerciseDto, user: User): Promise<Exercise> {
    // Kiểm tra lesson có tồn tại và quyền sở hữu
    const lesson = await this.lessonRepository.findOne({
      where: { id: dto.lessonId },
      relations: ['course', 'course.creator'],
    });

    if (!lesson) {
      throw new NotFoundException('Bài học không tồn tại');
    }

    if (lesson.course.creator.id !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền tạo bài tập cho bài học này',
      );
    }

    // Tạo bài tập
    const exercise = this.exerciseRepository.create({
      title: dto.title,
      description: dto.description,
      type: dto.type,
      timeLimit: dto.timeLimit,
      passingScore: dto.passingScore || 70,
      orderIndex: dto.orderIndex || 1,
      lesson: { id: dto.lessonId },
    });

    const savedExercise = await this.exerciseRepository.save(exercise);

    // Tạo câu hỏi
    const questions = dto.questions.map((q, index) =>
      this.questionRepository.create({
        question: q.question,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points || 1,
        orderIndex: q.orderIndex || index + 1,
        exercise: savedExercise,
      }),
    );

    await this.questionRepository.save(questions);

    const result = await this.exerciseRepository.findOne({
      where: { id: savedExercise.id },
      relations: ['questions'],
    });

    if (!result) {
      throw new Error('Failed to retrieve created exercise');
    }

    return result;
  }

  // 2. Lấy danh sách bài tập theo lesson
  async findByLesson(lessonId: string): Promise<Exercise[]> {
    return this.exerciseRepository.find({
      where: { lesson: { id: lessonId } },
      relations: ['questions'],
      order: { orderIndex: 'ASC' },
    });
  }

  // 3. Lấy chi tiết bài tập (có câu hỏi)
  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: ['questions', 'lesson'],
    });

    if (!exercise) {
      throw new NotFoundException('Bài tập không tồn tại');
    }

    // Sort questions by orderIndex
    if (exercise.questions) {
      exercise.questions.sort((a, b) => a.orderIndex - b.orderIndex);
    }

    return exercise;
  }

  // 4. Học viên nộp bài và tự động chấm
  async submit(
    exerciseId: string,
    dto: SubmitExerciseDto,
    user: User,
    timeSpent?: number,
  ): Promise<ExerciseResult> {
    const exercise = await this.findOne(exerciseId);

    let correctCount = 0;
    const totalQuestions = exercise.questions.length;

    // Chấm điểm
    exercise.questions.forEach((question) => {
      const userAnswer = dto.answers[question.id];
      if (userAnswer) {
        const isCorrect = this.checkAnswer(
          question.type,
          userAnswer,
          question.correctAnswer,
        );
        if (isCorrect) correctCount++;
      }
    });

    const score = (correctCount / totalQuestions) * 100;
    const passed = score >= exercise.passingScore;

    // Lưu kết quả
    const result = this.resultRepository.create({
      answers: dto.answers,
      score: Math.round(score * 100) / 100, // Round to 2 decimal places
      correctCount,
      totalQuestions,
      timeSpent,
      passed,
      user: { id: user.id },
      exercise: { id: exerciseId },
    });

    const savedResult = await this.resultRepository.save(result);

    // 🎮 Gamification: Award points and update streak
    try {
      // 1. Award base points for completing exercise
      await this.gamificationService.awardPoints(
        user.id,
        20,
        'Hoàn thành bài tập',
      );

      // 2. Bonus for perfect score
      if (score === 100) {
        await this.gamificationService.awardPoints(
          user.id,
          10,
          'Đạt điểm tuyệt đối',
        );
        await this.gamificationService.unlockAchievement(
          user.id,
          AchievementType.PERFECT_EXERCISE,
        );
      }

      // 3. Update daily streak
      await this.gamificationService.updateStreak(user.id);

      // 4. Check exercise count achievements
      const exerciseCount = await this.resultRepository.count({
        where: { user: { id: user.id } },
        relations: ['exercise'],
      });

      if (exerciseCount === 5) {
        await this.gamificationService.unlockAchievement(
          user.id,
          AchievementType.COMPLETE_5_EXERCISES,
        );
      }
    } catch (error) {
      console.error('Error awarding gamification points:', error);
      // Don't fail the submission if gamification fails
    }

    return savedResult;
  }

  // 5. Lấy kết quả của user cho bài tập
  async getUserResult(
    exerciseId: string,
    userId: string,
  ): Promise<ExerciseResult | null> {
    return this.resultRepository.findOne({
      where: {
        exercise: { id: exerciseId },
        user: { id: userId },
      },
      order: { completedAt: 'DESC' }, // Lấy lần làm gần nhất
    });
  }

  // 6. Lấy lịch sử làm bài của user
  async getUserHistory(
    exerciseId: string,
    userId: string,
  ): Promise<ExerciseResult[]> {
    return this.resultRepository.find({
      where: {
        exercise: { id: exerciseId },
        user: { id: userId },
      },
      order: { completedAt: 'DESC' },
    });
  }

  // Helper: Kiểm tra đáp án
  private checkAnswer(
    type: string,
    userAnswer: string,
    correctAnswer: string,
  ): boolean {
    const normalizedUserAnswer = String(userAnswer).toLowerCase().trim();
    const normalizedCorrectAnswer = String(correctAnswer).toLowerCase().trim();

    switch (type) {
      case 'MULTIPLE_CHOICE':
      case 'TRUE_FALSE':
        return normalizedUserAnswer === normalizedCorrectAnswer;

      case 'FILL_BLANK':
      case 'SHORT_ANSWER':
        // Có thể cải thiện: xóa dấu câu, so sánh gần đúng
        return normalizedUserAnswer === normalizedCorrectAnswer;

      case 'MATCHING':
        // So sánh JSON object
        try {
          const userObj = JSON.parse(userAnswer);
          const correctObj = JSON.parse(correctAnswer);
          return JSON.stringify(userObj) === JSON.stringify(correctObj);
        } catch {
          return false;
        }

      default:
        return normalizedUserAnswer === normalizedCorrectAnswer;
    }
  }
}
