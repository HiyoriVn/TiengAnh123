import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import { CourseStatus } from '../entities/course.entity';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'Tiêu đề khóa học không được để trống' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Giá khóa học không được âm' })
  price?: number;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus; // DRAFT hoặc PUBLISHED
}
