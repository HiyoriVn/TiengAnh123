import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PlacementTest } from './placement-test.entity';
import { CourseLevel } from './course.entity';

@Entity('user_placement_results')
export class UserPlacementResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PlacementTest, (test) => test.results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'test_id' })
  test: PlacementTest;

  @Column({ type: 'int' })
  score: number; // Total score achieved

  @Column({ type: 'int' })
  totalPoints: number; // Maximum possible points

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number; // Score percentage

  @Column({
    type: 'enum',
    enum: CourseLevel,
  })
  level: CourseLevel; // Determined level (A1, A2, B1, B2, C1, C2)

  // User's answers (JSON)
  // Example: {"question_id": "user_answer", ...}
  @Column({ type: 'jsonb' })
  answers: Record<string, string>;

  // Detailed skill breakdown (JSON)
  // Example: {"listening": 70, "reading": 65, "grammar": 80}
  @Column({ type: 'jsonb', nullable: true })
  skillBreakdown: Record<string, number>;

  @Column({ name: 'time_taken', type: 'int', nullable: true })
  timeTaken: number; // Time taken in seconds

  @Column({ name: 'can_retake', type: 'boolean', default: false })
  canRetake: boolean; // Giảng viên cho phép làm lại

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;
}
