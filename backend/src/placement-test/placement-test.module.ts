import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacementTest } from '../entities/placement-test.entity';
import { PlacementQuestion } from '../entities/placement-question.entity';
import { UserPlacementResult } from '../entities/user-placement-result.entity';
import { User } from '../entities/user.entity';
import { PlacementTestService } from './placement-test.service';
import { PlacementTestController } from './placement-test.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlacementTest,
      PlacementQuestion,
      UserPlacementResult,
      User,
    ]),
  ],
  providers: [PlacementTestService],
  controllers: [PlacementTestController],
  exports: [PlacementTestService],
})
export class PlacementTestModule {}
