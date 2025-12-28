import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  QuestionType,
  QuestionSkill,
} from '../entities/placement-question.entity';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsEnum(QuestionSkill)
  skill: QuestionSkill;

  @IsInt()
  @Min(1)
  order: number;

  @IsInt()
  @Min(1)
  points: number;

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsNotEmpty()
  correctAnswer: string | Record<string, string>;

  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @IsString()
  @IsOptional()
  explanation?: string;
}

export class CreatePlacementTestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsInt()
  @Min(1)
  totalQuestions: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
