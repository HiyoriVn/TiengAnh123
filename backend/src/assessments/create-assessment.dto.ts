import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsInt,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateAssessmentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsEnum(['PLACEMENT', 'LESSON_QUIZ'])
  type: string;

  @IsInt()
  duration: number; // Phút

  @IsUUID()
  @IsOptional()
  courseId?: string; // Nếu là bài kiểm tra trong khóa học
}
