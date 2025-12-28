import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Exercise } from './exercise.entity';

@Entity('exercise_results')
export class ExerciseResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Lưu câu trả lời dưới dạng JSON
  // { "question_id_1": "answer", "question_id_2": "answer", ... }
  @Column({ type: 'jsonb' })
  answers: Record<string, string>;

  // Điểm số (%)
  @Column({ type: 'float' })
  score: number;

  // Số câu đúng / tổng số câu
  @Column({ name: 'correct_count', type: 'int' })
  correctCount: number;

  @Column({ name: 'total_questions', type: 'int' })
  totalQuestions: number;

  // Thời gian hoàn thành (giây)
  @Column({ name: 'time_spent', type: 'int', nullable: true })
  timeSpent: number;

  // Có đạt yêu cầu không
  @Column({ default: false })
  passed: boolean;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;

  // Quan hệ: Học viên làm bài
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Quan hệ: Bài tập nào
  @ManyToOne(() => Exercise)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
}
