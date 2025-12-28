import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  // Lấy tất cả documents của một user (giảng viên)
  async findByUser(userId: string) {
    return this.documentRepository.find({
      where: { uploadedBy: { id: userId } },
      relations: ['lesson', 'lesson.course'],
      order: { createdAt: 'DESC' },
    });
  }

  // Lấy documents của một lesson
  async findByLesson(lessonId: string) {
    return this.documentRepository.find({
      where: { lesson: { id: lessonId } },
      relations: ['uploadedBy'],
      order: { createdAt: 'ASC' },
    });
  }

  // Xóa document (chỉ người upload hoặc admin mới được xóa)
  async deleteDocument(id: string, user: User) {
    const doc = await this.documentRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });

    if (!doc) throw new NotFoundException('Tài liệu không tồn tại');

    // Kiểm tra quyền: chỉ người tạo hoặc admin mới xóa được
    if (doc.uploadedBy.id !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xóa tài liệu này');
    }

    await this.documentRepository.softDelete(id);
    return { message: 'Xóa tài liệu thành công' };
  }
}
