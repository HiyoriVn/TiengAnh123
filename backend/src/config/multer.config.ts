import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Cấu hình Multer cho file upload
export const multerOptions: MulterOptions = {
  // File size limit: 50MB cho video, 10MB cho audio, 5MB cho PDF
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },

  // File filter - chỉ cho phép video, audio, PDF
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      // Video
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime', // .mov
      // Audio
      'audio/mpeg', // .mp3
      'audio/wav',
      'audio/ogg',
      'audio/mp4', // .m4a
      // PDF
      'application/pdf',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          `Loại file không được hỗ trợ. Chỉ chấp nhận video (mp4, webm, ogg, mov), audio (mp3, wav, ogg, m4a), và PDF`,
        ),
        false,
      );
    }
  },

  // Storage configuration
  storage: diskStorage({
    destination: './uploads', // Thư mục lưu file
    filename: (req, file, cb) => {
      // Tạo tên file unique: timestamp-random-originalname.ext
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${Date.now()}-${randomName}${extname(file.originalname)}`);
    },
  }),
};

// Hàm validate file size cho từng loại
export function validateFileSize(file: Express.Multer.File) {
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5MB

  if (file.mimetype.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
    throw new BadRequestException('Video không được vượt quá 50MB');
  }

  if (file.mimetype.startsWith('audio/') && file.size > MAX_AUDIO_SIZE) {
    throw new BadRequestException('Audio không được vượt quá 10MB');
  }

  if (file.mimetype === 'application/pdf' && file.size > MAX_PDF_SIZE) {
    throw new BadRequestException('PDF không được vượt quá 5MB');
  }

  return true;
}
