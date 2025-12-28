import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExerciseType } from '../entities/exercise.entity';
import { ExerciseQuestionType } from '../entities/exercise-question.entity';

export class CreateExerciseQuestionDto {
  @IsNotEmpty({ message: 'Câu hỏi không được để trống' })
  @IsString()
  question: string;

  @IsEnum(ExerciseQuestionType)
  type: ExerciseQuestionType;

  @IsOptional()
  @IsArray()
  options?: string[]; // Các lựa chọn cho MULTIPLE_CHOICE, MATCHING

  @IsNotEmpty({ message: 'Đáp án đúng không được để trống' })
  @IsString()
  correctAnswer: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  points?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number;
}

export class CreateExerciseDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ExerciseType)
  type: ExerciseType;

  @IsUUID('4', { message: 'Lesson ID phải là UUID hợp lệ' })
  lessonId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimit?: number; // Phút

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseQuestionDto)
  questions: CreateExerciseQuestionDto[];
}
