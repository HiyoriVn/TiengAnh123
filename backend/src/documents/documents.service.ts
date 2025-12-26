import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { Lesson } from '../entities/lesson.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async uploadFile(file: Express.Multer.File, lessonId: string, user: User) {
    // 1. Kiểm tra bài học có tồn tại không
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException('Bài học không tồn tại');

    // 2. Tạo đường dẫn file (URL) để Frontend truy cập
    // Ví dụ: http://localhost:3000/uploads/filename.mp4
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;

    // 3. Lưu thông tin vào DB
    const newDoc = this.documentRepository.create({
      fileName: file.originalname, // Tên gốc (vd: bai_giang.pdf)
      filePath: fileUrl, // Đường dẫn truy cập
      fileType: file.mimetype, // Loại file (video/mp4, application/pdf...)
      lesson: lesson,
      uploadedBy: user,
    });

    return this.documentRepository.save(newDoc);
  }
}
