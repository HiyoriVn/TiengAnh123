import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity'; // Import Course để liên kết

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string; // Nội dung bài học (HTML/Markdown)

  @Column({ name: 'video_url', nullable: true })
  videoUrl: string; // Link video (Youtube/Firebase)

  @Column({ name: 'course_id' })
  courseId: string;

  // Thiết lập quan hệ: Nhiều bài học thuộc về 1 khóa học
  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' }) // Liên kết qua cột course_id
  course: Course;
}
