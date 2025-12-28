import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PlacementTestService } from './placement-test.service';
import { CreatePlacementTestDto } from './create-placement-test.dto';
import { SubmitPlacementTestDto } from './submit-placement-test.dto';
import { UpdatePlacementTestStatusDto } from './update-placement-test.dto';

@Controller('placement-test')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PlacementTestController {
  constructor(private readonly placementTestService: PlacementTestService) {}

  // ==================== LECTURER ROUTES ====================

  @Post()
  @Roles('LECTURER', 'ADMIN')
  async createTest(@Body() createDto: CreatePlacementTestDto) {
    const test = await this.placementTestService.createTest(createDto);
    return {
      message: 'Tạo bài kiểm tra thành công',
      test,
    };
  }

  @Get('all')
  @Roles('LECTURER', 'ADMIN')
  async getAllTests() {
    return this.placementTestService.getAllTests();
  }

  @Patch(':id/status')
  @Roles('LECTURER', 'ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdatePlacementTestStatusDto,
  ) {
    const test = await this.placementTestService.updateTestStatus(
      id,
      updateDto,
    );
    return {
      message: 'Cập nhật trạng thái thành công',
      test,
    };
  }

  @Patch('result/:resultId/allow-retake')
  @Roles('LECTURER', 'ADMIN')
  async allowRetake(@Param('resultId') resultId: string) {
    const result = await this.placementTestService.allowRetake(resultId);
    return {
      message: 'Đã cho phép học viên làm lại bài kiểm tra',
      result,
    };
  }

  // ==================== STUDENT ROUTES ====================

  @Get('active')
  async getActiveTest() {
    return this.placementTestService.getActiveTest();
  }

  @Get('check-eligibility')
  async checkEligibility(
    @Request() req: Express.Request & { user: { userId: string } },
  ) {
    return this.placementTestService.checkUserCanTakeTest(req.user.userId);
  }

  @Post('submit')
  async submitTest(
    @Request() req: Express.Request & { user: { userId: string } },
    @Body() submitDto: SubmitPlacementTestDto,
  ) {
    const result = await this.placementTestService.submitTest(
      req.user.userId,
      submitDto,
    );
    return {
      message: 'Hoàn thành bài kiểm tra thành công',
      result,
    };
  }

  @Get('my-result')
  async getMyResult(
    @Request() req: Express.Request & { user: { userId: string } },
  ) {
    const result = await this.placementTestService.getUserResult(
      req.user.userId,
    );
    return result;
  }
}
