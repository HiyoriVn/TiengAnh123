import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exercise } from './exercise.entity';

export enum ExerciseQuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', // Trắc nghiệm
  TRUE_FALSE = 'TRUE_FALSE', // Đúng/Sai
  FILL_BLANK = 'FILL_BLANK', // Điền vào chỗ trống
  MATCHING = 'MATCHING', // Nối cặp
  SHORT_ANSWER = 'SHORT_ANSWER', // Câu trả lời ngắn
}

@Entity('exercise_questions')
export class ExerciseQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @Column({
    type: 'enum',
    enum: ExerciseQuestionType,
    default: ExerciseQuestionType.MULTIPLE_CHOICE,
  })
  type: ExerciseQuestionType;

  // Lưu options dưới dạng JSON (cho MULTIPLE_CHOICE, MATCHING)
  // Ví dụ: ["option A", "option B", "option C", "option D"]
  @Column({ type: 'jsonb', nullable: true })
  options: string[];

  // Đáp án đúng (có thể là text, index, hoặc JSON)
  // MULTIPLE_CHOICE: "B" hoặc "1"
  // TRUE_FALSE: "true" hoặc "false"
  // FILL_BLANK: "correct answer"
  // MATCHING: JSON object {"1": "A", "2": "B"}
  @Column({ name: 'correct_answer', type: 'text' })
  correctAnswer: string;

  // Giải thích đáp án (hiện sau khi submit)
  @Column({ type: 'text', nullable: true })
  explanation: string;

  // Điểm số của câu này
  @Column({ type: 'float', default: 1 })
  points: number;

  @Column({ name: 'order_index', type: 'int', default: 1 })
  orderIndex: number;

  // Quan hệ: Thuộc về 1 bài tập
  @ManyToOne(() => Exercise, (exercise) => exercise.questions)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
}
