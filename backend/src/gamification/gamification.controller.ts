import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GamificationService } from './gamification.service';
import { AchievementType } from '../entities/achievement.entity';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  // POST /gamification/init - Initialize achievements (admin only)
  @Post('init')
  initializeAchievements() {
    return this.gamificationService.initializeAchievements();
  }

  // GET /gamification/my-achievements - Get current user's achievements
  @Get('my-achievements')
  @UseGuards(AuthGuard('jwt'))
  getMyAchievements(@Request() req) {
    return this.gamificationService.getUserAchievements(req.user.id);
  }

  // GET /gamification/achievements - Get all available achievements
  @Get('achievements')
  getAllAchievements() {
    return this.gamificationService.getAllAchievements();
  }

  // GET /gamification/leaderboard - Get leaderboard
  @Get('leaderboard')
  getLeaderboard(@Query('limit') limit?: number) {
    return this.gamificationService.getLeaderboard(limit || 10);
  }

  // GET /gamification/my-stats - Get current user stats
  @Get('my-stats')
  @UseGuards(AuthGuard('jwt'))
  getMyStats(@Request() req) {
    return this.gamificationService.getUserStats(req.user.id);
  }

  // POST /gamification/award-points/:userId - Award points (for internal use)
  @Post('award-points/:userId')
  @UseGuards(AuthGuard('jwt'))
  awardPoints(@Param('userId') userId: string, @Request() req) {
    // You can add admin check here
    return this.gamificationService.awardPoints(userId, 10, 'Manual award');
  }

  // POST /gamification/update-streak - Update user streak
  @Post('update-streak')
  @UseGuards(AuthGuard('jwt'))
  updateStreak(@Request() req) {
    return this.gamificationService.updateStreak(req.user.id);
  }
}
