import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PlacementQuestion } from './placement-question.entity';
import { UserPlacementResult } from './user-placement-result.entity';

export enum PlacementTestStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity('placement_tests')
export class PlacementTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 30 })
  duration: number; // Duration in minutes

  @Column({
    type: 'enum',
    enum: PlacementTestStatus,
    default: PlacementTestStatus.DRAFT,
  })
  status: PlacementTestStatus;

  @Column({ name: 'total_questions', type: 'int', default: 20 })
  totalQuestions: number;

  // Quan hệ: 1 placement test có nhiều câu hỏi
  @OneToMany(() => PlacementQuestion, (question) => question.test, {
    cascade: true,
  })
  questions: PlacementQuestion[];

  // Quan hệ: 1 placement test có nhiều kết quả
  @OneToMany(() => UserPlacementResult, (result) => result.test)
  results: UserPlacementResult[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
