import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Assessment } from './assessment.entity';

@Entity('user_results')
export class UserResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  score: number;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;

  // Quan hệ: Học viên làm bài
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Quan hệ: Bài kiểm tra nào
  @ManyToOne(() => Assessment)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;
}
