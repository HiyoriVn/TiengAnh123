import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { Enrollment } from './entities/enrollment.entity';
import { Assessment } from './entities/assessment.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { UserResult } from './entities/user-result.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { Document } from './entities/document.entity';
import { Submission } from './entities/submission.entity';
import { DocumentsModule } from './documents/documents.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { PlacementTestModule } from './placement-test/placement-test.module';
import { PlacementTest } from './entities/placement-test.entity';
import { PlacementQuestion } from './entities/placement-question.entity';
import { UserPlacementResult } from './entities/user-placement-result.entity';
import { Exercise } from './entities/exercise.entity';
import { ExerciseQuestion } from './entities/exercise-question.entity';
import { ExerciseResult } from './entities/exercise-result.entity';
import { ExercisesModule } from './exercises/exercises.module';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { UserLessonProgress } from './entities/user-lesson-progress.entity';
import { GamificationModule } from './gamification/gamification.module';

@Module({
  imports: [
    // Load environment variables từ file .env
    ConfigModule.forRoot({
      isGlobal: true, // Cho phép sử dụng env vars trong toàn bộ app
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin', // Theo cấu hình docker của bạn
      password: 'adminpassword', // Theo cấu hình docker của bạn
      database: 'tienganh123_db', // Theo cấu hình docker của bạn
      entities: [
        User,
        Course,
        Lesson,
        Enrollment,
        Assessment,
        Question,
        Answer,
        UserResult,
        Document,
        Submission,
        PlacementTest,
        PlacementQuestion,
        UserPlacementResult,
        Exercise,
        ExerciseQuestion,
        ExerciseResult,
        Achievement,
        UserAchievement,
        UserLessonProgress,
      ],
      synchronize: true, // Tự động tạo bảng (chỉ dùng cho Dev)
    }),
    UsersModule,
    AuthModule,
    CoursesModule,
    LessonsModule,
    EnrollmentsModule,
    DocumentsModule,
    AssessmentsModule,
    SubmissionsModule,
    PlacementTestModule,
    ExercisesModule,
    GamificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
