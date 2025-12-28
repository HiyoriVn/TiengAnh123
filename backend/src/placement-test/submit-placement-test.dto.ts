import { IsNotEmpty, IsObject } from 'class-validator';

export class SubmitPlacementTestDto {
  @IsNotEmpty()
  testId: string;

  @IsObject()
  @IsNotEmpty()
  answers: Record<string, string>; // { "question_id": "user_answer" }

  @IsNotEmpty()
  timeTaken: number; // Time taken in seconds
}
