import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { ExerciseQuestion } from './exercise-question.entity';

export enum ExerciseType {
  PRACTICE = 'PRACTICE', // Bài tập luyện tập
  QUIZ = 'QUIZ', // Bài kiểm tra nhỏ
  HOMEWORK = 'HOMEWORK', // Bài tập về nhà
}

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ExerciseType,
    default: ExerciseType.PRACTICE,
  })
  type: ExerciseType;

  @Column({ name: 'time_limit', type: 'int', nullable: true })
  timeLimit: number; // Giới hạn thời gian (phút), null = không giới hạn

  @Column({ name: 'passing_score', type: 'float', default: 70 })
  passingScore: number; // Điểm đạt (%)

  @Column({ name: 'order_index', type: 'int', default: 1 })
  orderIndex: number; // Thứ tự trong bài học

  // Quan hệ: Thuộc về 1 bài học
  @ManyToOne(() => Lesson)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  // Quan hệ: 1 bài tập có nhiều câu hỏi
  @OneToMany(() => ExerciseQuestion, (question) => question.exercise, {
    cascade: true,
  })
  questions: ExerciseQuestion[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
