import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  // 1. Tạo khóa học mới
  async create(createCourseDto: CreateCourseDto) {
    const newCourse = this.coursesRepository.create(createCourseDto);
    return await this.coursesRepository.save(newCourse);
  }

  // 2. Lấy tất cả khóa học
  async findAll() {
    return await this.coursesRepository.find();
  }

  // 3. Lấy 1 khóa học theo ID
  async findOne(id: string) {
    return await this.coursesRepository.findOneBy({ id });
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `Update course #${id}`;
  }

  remove(id: number) {
    return `Remove course #${id}`;
  }
}
