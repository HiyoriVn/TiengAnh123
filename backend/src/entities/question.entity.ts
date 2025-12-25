import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';
import { Answer } from './answer.entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_BLANK = 'FILL_BLANK',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.MULTIPLE_CHOICE,
  })
  type: QuestionType;

  @Column({ type: 'float', default: 1 })
  score: number;

  // Quan hệ: Thuộc về 1 Đề kiểm tra
  @ManyToOne(() => Assessment, (assessment) => assessment.questions)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  // Quan hệ: 1 Câu hỏi có nhiều đáp án lựa chọn
  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
