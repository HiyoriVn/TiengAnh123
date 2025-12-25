import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
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
      ],
      synchronize: true, // Tự động tạo bảng (chỉ dùng cho Dev)
    }),
    UsersModule,
    AuthModule,
    CoursesModule,
    LessonsModule,
    EnrollmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
