import { IsNotEmpty, IsObject } from 'class-validator';

export class SubmitExerciseDto {
  @IsNotEmpty({ message: 'Câu trả lời không được để trống' })
  @IsObject()
  answers: Record<string, string>; // { "question_id": "answer", ... }
}
