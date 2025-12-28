import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Assessment } from './assessment.entity';

@Entity('submissions')
@Index(['student'])
@Index(['assessment'])
@Index(['status'])
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_work', type: 'text', nullable: true })
  fileWork: string; // Link file bài làm hoặc nội dung text

  @Column({ type: 'float', nullable: true })
  score: number; // Điểm số

  @Column({ type: 'text', nullable: true })
  comment: string; // Nhận xét của giảng viên

  @Column({ default: 'SUBMITTED' }) // SUBMITTED, GRADED
  status: string;

  @CreateDateColumn({ name: 'submit_date' })
  submitDate: Date;

  // Quan hệ: Học viên nộp bài
  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  // Quan hệ: Thuộc bài kiểm tra nào
  @ManyToOne(() => Assessment)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  // Quan hệ: Ai chấm (Giảng viên)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'graded_by' })
  gradedBy: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
