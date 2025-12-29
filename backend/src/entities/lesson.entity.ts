import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Course } from './course.entity';
import { OneToMany } from 'typeorm';
import { Document } from './document.entity';

@Entity('lessons')
@Index(['course'])
@Index(['approvalStatus'])
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'video_url', nullable: true })
  videoUrl: string;

  @Column({ name: 'audio_url', nullable: true })
  audioUrl: string;

  @Column({ name: 'pdf_url', nullable: true })
  pdfUrl: string;

  @Column({ name: 'order_index', type: 'int', default: 1 })
  orderIndex: number;

  // Quan hệ: Nhiều bài học thuộc về 1 khóa học
  @ManyToOne(() => Course, (course) => course.lessons)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  // Trạng thái duyệt bài (PENDING / APPROVED / REJECTED)
  @Column({ name: 'approval_status', default: 'PENDING' })
  approvalStatus: string;

  // Trạng thái xuất bản (để filter cho học viên)
  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  // Quan hệ 1 bài học có nhiều tài liệu đính kèm
  @OneToMany(() => Document, (document) => document.lesson)
  documents: Document[];
}
