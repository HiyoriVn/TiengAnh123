import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Question } from './question.entity';

export enum AssessmentType {
  PLACEMENT = 'PLACEMENT', // Kiểm tra đầu vào
  LESSON_QUIZ = 'LESSON_QUIZ', // Kiểm tra bài học
}

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: AssessmentType,
    default: AssessmentType.LESSON_QUIZ,
  })
  type: AssessmentType;

  @Column({ type: 'int', default: 15 })
  duration: number; // Thời gian làm bài (phút)

  // Quan hệ: Thuộc về 1 Course (Nếu là bài đầu vào chung thì có thể null)
  @ManyToOne(() => Course, (course) => course.assessments, { nullable: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  // Quan hệ: 1 Đề có nhiều câu hỏi
  @OneToMany(() => Question, (question) => question.assessment)
  questions: Question[];
}
