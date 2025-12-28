import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Achievement, AchievementType } from '../entities/achievement.entity';
import { UserAchievement } from '../entities/user-achievement.entity';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
  ) {}

  // Initialize achievements data (seed)
  async initializeAchievements() {
    const achievementsData = [
      {
        type: AchievementType.FIRST_LESSON,
        name: 'Khởi đầu mới',
        description: 'Hoàn thành bài học đầu tiên',
        icon: 'school',
        pointsRequired: 0,
      },
      {
        type: AchievementType.COMPLETE_5_LESSONS,
        name: 'Người học chăm chỉ',
        description: 'Hoàn thành 5 bài học',
        icon: 'auto_stories',
        pointsRequired: 0,
      },
      {
        type: AchievementType.COMPLETE_10_LESSONS,
        name: 'Học giả',
        description: 'Hoàn thành 10 bài học',
        icon: 'menu_book',
        pointsRequired: 0,
      },
      {
        type: AchievementType.COMPLETE_COURSE,
        name: 'Hoàn thành khóa học',
        description: 'Hoàn thành toàn bộ một khóa học',
        icon: 'workspace_premium',
        pointsRequired: 0,
      },
      {
        type: AchievementType.STREAK_3_DAYS,
        name: 'Kiên trì',
        description: 'Học liên tục 3 ngày',
        icon: 'local_fire_department',
        pointsRequired: 0,
      },
      {
        type: AchievementType.STREAK_7_DAYS,
        name: 'Tuần lễ vàng',
        description: 'Học liên tục 7 ngày',
        icon: 'whatshot',
        pointsRequired: 0,
      },
      {
        type: AchievementType.STREAK_30_DAYS,
        name: 'Huyền thoại',
        description: 'Học liên tục 30 ngày',
        icon: 'emoji_events',
        pointsRequired: 0,
      },
      {
        type: AchievementType.EARN_100_POINTS,
        name: 'Trăm điểm đầu tiên',
        description: 'Đạt 100 điểm',
        icon: 'stars',
        pointsRequired: 100,
      },
      {
        type: AchievementType.EARN_500_POINTS,
        name: 'Ngôi sao sáng',
        description: 'Đạt 500 điểm',
        icon: 'star',
        pointsRequired: 500,
      },
      {
        type: AchievementType.EARN_1000_POINTS,
        name: 'Bậc thầy',
        description: 'Đạt 1000 điểm',
        icon: 'military_tech',
        pointsRequired: 1000,
      },
      {
        type: AchievementType.PERFECT_EXERCISE,
        name: 'Hoàn hảo',
        description: 'Đạt 100% điểm trong một bài tập',
        icon: 'verified',
        pointsRequired: 0,
      },
      {
        type: AchievementType.COMPLETE_5_EXERCISES,
        name: 'Thạc sĩ bài tập',
        description: 'Hoàn thành 5 bài tập',
        icon: 'assignment_turned_in',
        pointsRequired: 0,
      },
    ];

    for (const data of achievementsData) {
      const existing = await this.achievementRepository.findOne({
        where: { type: data.type },
      });
      if (!existing) {
        await this.achievementRepository.save(data);
      }
    }

    return { message: 'Achievements initialized' };
  }

  // Award points to user
  async awardPoints(userId: string, points: number, reason: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.points += points;
    await this.userRepository.save(user);

    // Check for point-based achievements
    await this.checkPointAchievements(user);

    return {
      message: `Awarded ${points} points for ${reason}`,
      totalPoints: user.points,
    };
  }

  // Update streak
  async updateStreak(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = user.lastActivityDate
      ? new Date(user.lastActivityDate)
      : null;

    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff === 1) {
        // Consecutive day
        user.streak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        user.streak = 1;
      }
      // If daysDiff === 0, already updated today, do nothing
    } else {
      // First activity
      user.streak = 1;
    }

    user.lastActivityDate = today;
    await this.userRepository.save(user);

    // Check for streak-based achievements
    await this.checkStreakAchievements(user);

    return { streak: user.streak };
  }

  // Check and award point-based achievements
  private async checkPointAchievements(user: User) {
    const pointMilestones = [
      { type: AchievementType.EARN_100_POINTS, points: 100 },
      { type: AchievementType.EARN_500_POINTS, points: 500 },
      { type: AchievementType.EARN_1000_POINTS, points: 1000 },
    ];

    for (const milestone of pointMilestones) {
      if (user.points >= milestone.points) {
        await this.unlockAchievement(user.id, milestone.type);
      }
    }
  }

  // Check and award streak-based achievements
  private async checkStreakAchievements(user: User) {
    const streakMilestones = [
      { type: AchievementType.STREAK_3_DAYS, days: 3 },
      { type: AchievementType.STREAK_7_DAYS, days: 7 },
      { type: AchievementType.STREAK_30_DAYS, days: 30 },
    ];

    for (const milestone of streakMilestones) {
      if (user.streak >= milestone.days) {
        await this.unlockAchievement(user.id, milestone.type);
      }
    }
  }

  // Unlock achievement for user
  async unlockAchievement(userId: string, type: AchievementType) {
    // Check if already unlocked
    const existing = await this.userAchievementRepository.findOne({
      where: {
        user: { id: userId },
        achievement: { type },
      },
    });

    if (existing) return null; // Already unlocked

    const achievement = await this.achievementRepository.findOne({
      where: { type },
    });
    if (!achievement) return null;

    const userAchievement = this.userAchievementRepository.create({
      user: { id: userId },
      achievement,
    });

    return this.userAchievementRepository.save(userAchievement);
  }

  // Get user achievements
  async getUserAchievements(userId: string) {
    return this.userAchievementRepository.find({
      where: { user: { id: userId } },
      relations: ['achievement'],
      order: { earnedAt: 'DESC' },
    });
  }

  // Get all achievements
  async getAllAchievements() {
    return this.achievementRepository.find({
      order: { pointsRequired: 'ASC' },
    });
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 10) {
    return this.userRepository.find({
      where: { role: UserRole.STUDENT },
      order: { points: 'DESC' },
      take: limit,
      select: ['id', 'username', 'fullName', 'avatar', 'points', 'streak'],
    });
  }

  // Get user stats
  async getUserStats(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const achievements = await this.getUserAchievements(userId);

    // Get user rank
    const allUsers = await this.userRepository.find({
      where: { role: UserRole.STUDENT },
      order: { points: 'DESC' },
      select: ['id', 'points'],
    });
    const rank = allUsers.findIndex((u) => u.id === userId) + 1;

    return {
      points: user.points,
      streak: user.streak,
      achievementCount: achievements.length,
      rank,
      totalUsers: allUsers.length,
    };
  }
}
