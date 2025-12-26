import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { User } from './user.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'file_type' }) // video, pdf, audio
  fileType: string;

  // Quan hệ: Thuộc về bài học nào
  @ManyToOne(() => Lesson, (lesson) => lesson.documents)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  // Quan hệ: Ai tải lên (Giảng viên)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'soft_delete' })
  deletedAt: Date;
}
