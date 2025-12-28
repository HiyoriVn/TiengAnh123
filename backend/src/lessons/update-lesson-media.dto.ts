import {
  IsString,
  IsUrl,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateLessonMediaDto {
  @IsOptional()
  @IsUrl({}, { message: 'URL video không hợp lệ' })
  @MaxLength(500, { message: 'URL video không được vượt quá 500 ký tự' })
  @Matches(/\.(mp4|webm|ogg|mov)$/i, {
    message: 'URL video phải có định dạng .mp4, .webm, .ogg hoặc .mov',
  })
  videoUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL audio không hợp lệ' })
  @MaxLength(500, { message: 'URL audio không được vượt quá 500 ký tự' })
  @Matches(/\.(mp3|wav|ogg|m4a)$/i, {
    message: 'URL audio phải có định dạng .mp3, .wav, .ogg hoặc .m4a',
  })
  audioUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL PDF không hợp lệ' })
  @MaxLength(500, { message: 'URL PDF không được vượt quá 500 ký tự' })
  @Matches(/\.pdf$/i, { message: 'URL phải là file PDF (.pdf)' })
  pdfUrl?: string;
}
