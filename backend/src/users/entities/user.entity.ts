import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // Tên bảng trong Database sẽ là 'users' (số nhiều)
export class User {
  @PrimaryGeneratedColumn('uuid') // ID dạng chuỗi ngẫu nhiên (UUID) bảo mật hơn số thứ tự
  id: string;

  @Column({ unique: true }) // Email không được trùng nhau
  email: string;

  @Column()
  password: string;

  @Column({ name: 'full_name' }) // Tên cột trong DB là snake_case
  fullName: string; // Tên biến trong code là camelCase

  @Column({ default: 'STUDENT' }) // Mặc định là học viên
  role: string;

  @Column({ nullable: true }) // Cho phép để trống (null)
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
