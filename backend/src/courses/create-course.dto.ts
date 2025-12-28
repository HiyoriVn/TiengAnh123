import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import { CourseStatus, CourseLevel } from '../entities/course.entity';

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

  @IsOptional()
  @IsEnum(CourseLevel, {
    message: 'Level phải là A1, A2, B1, B2, C1, C2 hoặc ALL',
  })
  level?: CourseLevel;
}
