import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { Exercise } from '../entities/exercise.entity';
import { ExerciseQuestion } from '../entities/exercise-question.entity';
import { ExerciseResult } from '../entities/exercise-result.entity';
import { Lesson } from '../entities/lesson.entity';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exercise,
      ExerciseQuestion,
      ExerciseResult,
      Lesson,
    ]),
    GamificationModule,
  ],
  providers: [ExercisesService],
  controllers: [ExercisesController],
})
export class ExercisesModule {}
