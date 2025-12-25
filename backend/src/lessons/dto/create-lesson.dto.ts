export class CreateLessonDto {
  title: string;
  content: string;
  videoUrl: string;
  courseId: string; // Bắt buộc phải biết bài học này thuộc khóa nào
}
