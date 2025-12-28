import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Enrollment } from './enrollment.entity';

// Định nghĩa Enum cho Role như trong tài liệu
export enum UserRole {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  ADMIN = 'ADMIN',
}

@Entity('users') // Tên bảng trong Database là 'users' [cite: 277]
export class User {
  @PrimaryGeneratedColumn('uuid') // Kiểu dữ liệu UUID
  id: string;

  @Column({ unique: true }) // Ràng buộc Unique
  username: string;

  @Column({ unique: true }) // Ràng buộc Unique
  email: string;

  @Column()
  password: string;

  // Mapping: DB là full_name -> Code là fullName
  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ type: 'text', nullable: true }) // Nullable theo tài liệu
  bio: string;

  @Column({ nullable: true }) // Nullable theo tài liệu
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT, // Mặc định là học viên
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' }) // DB là created_at
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // DB là updated_at
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' }) // Hỗ trợ xóa mềm (Soft Delete)
  deletedAt: Date;

  @Column({ default: 'ACTIVE' })
  status: string;

  @Column({ nullable: true, name: 'reset_password_token' })
  resetPasswordToken: string;

  @Column({ nullable: true, name: 'reset_password_expiry' })
  resetPasswordExpiry: Date;

  // Mối quan hệ 1: Một user có thể tạo nhiều khóa học (Giảng viên)
  @OneToMany(() => Course, (course) => course.creator)
  createdCourses: Course[];

  // Mối quan hệ 2: Một user có thể đăng ký nhiều khóa học (Học viên)
  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];
}
