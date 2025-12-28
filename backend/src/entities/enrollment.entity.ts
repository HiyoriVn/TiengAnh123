import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('enrollments')
@Index(['user'])
@Index(['course'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  progress: number; // Tiến độ 0 - 100%

  // Quan hệ: Thuộc về 1 User (Học viên)
  @ManyToOne(() => User, (user) => user.enrollments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Quan hệ: Thuộc về 1 Course
  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @CreateDateColumn({ name: 'enrolled_at' })
  enrolledAt: Date;
}
