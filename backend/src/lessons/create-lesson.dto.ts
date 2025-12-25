import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty({ message: 'Tiêu đề bài học không được để trống' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @IsString()
  content: string;

  @IsNotEmpty({ message: 'ID khóa học không được để trống' })
  @IsUUID('4', { message: 'ID khóa học phải là UUID chuẩn' })
  courseId: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  orderIndex?: number; // Thứ tự bài học (Bài 1, Bài 2...)
}
