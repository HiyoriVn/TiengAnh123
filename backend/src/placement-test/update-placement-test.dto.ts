import { IsEnum, IsOptional } from 'class-validator';
import { PlacementTestStatus } from '../entities/placement-test.entity';

export class UpdatePlacementTestStatusDto {
  @IsEnum(PlacementTestStatus)
  status: PlacementTestStatus;
}

export class AllowRetakeDto {
  @IsOptional()
  userId?: string; // If not provided, allow all users to retake
}
