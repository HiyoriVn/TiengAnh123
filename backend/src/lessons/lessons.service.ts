import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  // 1. Tạo bài học mới
  async create(createLessonDto: CreateLessonDto) {
    const newLesson = this.lessonsRepository.create(createLessonDto);
    return await this.lessonsRepository.save(newLesson);
  }

  // 2. Lấy tất cả bài học
  async findAll() {
    return await this.lessonsRepository.find();
  }

  // 3. Lấy chi tiết 1 bài học
  async findOne(id: string) {
    return await this.lessonsRepository.findOneBy({ id });
  }

  // 4. (QUAN TRỌNG) Lấy danh sách bài học theo courseId
  async findByCourse(courseId: string) {
    return await this.lessonsRepository.find({
      where: { courseId: courseId },
      order: { title: 'ASC' }, // Sắp xếp theo tên (hoặc sau này thêm cột số thứ tự)
    });
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `Update lesson #${id}`;
  }

  remove(id: number) {
    return `Remove lesson #${id}`;
  }
}
