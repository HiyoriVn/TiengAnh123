import { IsString, IsOptional, IsUrl, IsNumber, Min } from 'class-validator';

// UpdateLessonDto for partial updates
export class UpdateLessonDto {
  @IsOptional()
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Nội dung phải là chuỗi ký tự' })
  content?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL video không hợp lệ' })
  videoUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL audio không hợp lệ' })
  audioUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL PDF không hợp lệ' })
  pdfUrl?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Thứ tự phải là số' })
  @Min(0, { message: 'Thứ tự không được âm' })
  orderIndex?: number;
}
