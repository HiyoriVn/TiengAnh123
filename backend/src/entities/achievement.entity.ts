import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum AchievementType {
  FIRST_LESSON = 'FIRST_LESSON',
  COMPLETE_5_LESSONS = 'COMPLETE_5_LESSONS',
  COMPLETE_10_LESSONS = 'COMPLETE_10_LESSONS',
  COMPLETE_COURSE = 'COMPLETE_COURSE',
  STREAK_3_DAYS = 'STREAK_3_DAYS',
  STREAK_7_DAYS = 'STREAK_7_DAYS',
  STREAK_30_DAYS = 'STREAK_30_DAYS',
  EARN_100_POINTS = 'EARN_100_POINTS',
  EARN_500_POINTS = 'EARN_500_POINTS',
  EARN_1000_POINTS = 'EARN_1000_POINTS',
  PERFECT_EXERCISE = 'PERFECT_EXERCISE',
  COMPLETE_5_EXERCISES = 'COMPLETE_5_EXERCISES',
}

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AchievementType,
    unique: true,
  })
  type: AchievementType;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  icon: string; // Material icon name

  @Column({ default: 0 })
  pointsRequired: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
