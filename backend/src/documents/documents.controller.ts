import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt')) // Yêu cầu đăng nhập
  @UseInterceptors(
    FileInterceptor('file', {
      // Cấu hình nơi lưu file
      storage: diskStorage({
        destination: './uploads', // Lưu vào thư mục uploads ở gốc dự án
        filename: (req, file, callback) => {
          // Đặt tên file ngẫu nhiên để tránh trùng (vd: random123.pdf)
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      // Giới hạn dung lượng (Ví dụ: 50MB)
      limits: { fileSize: 50 * 1024 * 1024 },
      // Lọc loại file (Chỉ cho phép Video, PDF, Audio)
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(pdf|mp4|mpeg|mp3|wav)$/)) {
          return callback(
            new BadRequestException('Chỉ hỗ trợ file PDF, Video, Audio'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File, // Lấy file từ request
    @Body('lessonId') lessonId: string, // Lấy lessonId từ body
    @Request() req,
  ) {
    if (!file) throw new BadRequestException('Chưa chọn file nào');
    return this.documentsService.uploadFile(file, lessonId, req.user);
  }
}
