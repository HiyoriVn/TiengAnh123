import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';

// Khi update thì không cho sửa courseId (bài học đã thuộc khóa nào thì nằm yên đó)
// Nên ta dùng OmitType để loại bỏ courseId (cần cài thêm nếu chưa có, hoặc đơn giản là tạo class mới)
// Để đơn giản cho bạn, ta cứ kế thừa PartialType, logic chặn sẽ nằm ở Service.
export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
