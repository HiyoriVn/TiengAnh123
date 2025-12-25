import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Import
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson } from './entities/lesson.entity'; // <--- Import Entity

@Module({
  imports: [TypeOrmModule.forFeature([Lesson])], // <--- Đăng ký Entity
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
