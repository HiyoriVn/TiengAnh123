import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';
import { Enrollment } from './enrollment.entity';
import { Assessment } from './assessment.entity';

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum CourseLevel {
  A1 = 'A1', // Beginner
  A2 = 'A2', // Elementary
  B1 = 'B1', // Intermediate
  B2 = 'B2', // Upper Intermediate
  C1 = 'C1', // Advanced
  C2 = 'C2', // Proficient
  ALL = 'ALL', // Mọi trình độ
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'cover_url', nullable: true })
  coverUrl: string;

  @Column({ type: 'decimal', default: 0 })
  price: number;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.ALL,
  })
  level: CourseLevel;

  // Quan hệ: Nhiều khóa học thuộc về 1 người tạo
  @ManyToOne(() => User, (user) => user.createdCourses)
  @JoinColumn({ name: 'creator_id' }) // Tên cột trong DB là creator_id
  creator: User;

  // Quan hệ: 1 khóa học có nhiều bài học
  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  // Quan hệ: 1 khóa học có nhiều lượt đăng ký
  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Quan hệ: 1 khóa học có nhiều bài kiểm tra
  @OneToMany(() => Assessment, (assessment) => assessment.course)
  assessments: Assessment[];
}
