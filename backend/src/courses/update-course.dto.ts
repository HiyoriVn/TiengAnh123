import { PartialType } from '@nestjs/mapped-types'; // Cần cài: npm i @nestjs/mapped-types
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
