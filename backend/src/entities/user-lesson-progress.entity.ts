import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';

@Entity('user_lesson_progress')
export class UserLessonProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Lesson)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}
