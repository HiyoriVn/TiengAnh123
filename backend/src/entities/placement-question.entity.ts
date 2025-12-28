import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PlacementTest } from './placement-test.entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', // Trắc nghiệm 4 đáp án
  FILL_BLANK = 'FILL_BLANK', // Điền từ
  TRUE_FALSE = 'TRUE_FALSE', // Đúng/Sai
  MATCHING = 'MATCHING', // Nối câu
  REWRITE = 'REWRITE', // Viết lại câu
}

export enum QuestionSkill {
  LISTENING = 'LISTENING',
  READING = 'READING',
  GRAMMAR = 'GRAMMAR',
  VOCABULARY = 'VOCABULARY',
}

@Entity('placement_questions')
export class PlacementQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PlacementTest, (test) => test.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'test_id' })
  test: PlacementTest;

  @Column({ type: 'text' })
  questionText: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  questionType: QuestionType;

  @Column({
    type: 'enum',
    enum: QuestionSkill,
  })
  skill: QuestionSkill;

  @Column({ type: 'int', default: 1 })
  order: number;

  @Column({ type: 'int', default: 1 })
  points: number;

  // Options for multiple choice (JSON array)
  // Example: ["Option A", "Option B", "Option C", "Option D"]
  @Column({ type: 'jsonb', nullable: true })
  options: string[];

  // Correct answer (flexible format based on question type)
  // - Multiple Choice: "A" or "0"
  // - Fill Blank: "correct word"
  // - True/False: "true" or "false"
  // - Matching: {"1": "a", "2": "b", ...}
  // - Rewrite: "expected sentence"
  @Column({ type: 'jsonb' })
  correctAnswer: string | Record<string, string>;

  // Media URL for listening questions
  @Column({ name: 'media_url', nullable: true })
  mediaUrl: string;

  // Explanation (optional)
  @Column({ type: 'text', nullable: true })
  explanation: string;
}
