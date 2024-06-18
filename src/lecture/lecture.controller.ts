import { Controller, Get, Query } from '@nestjs/common';
import { ExpandedLectureResDto } from './dto/res/lectureRes.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LectureService } from './lecture.service';
import { EvaluationQueryDto } from './dto/req/evaluationReq.dto';
import { EvaluationResDto } from './dto/res/evaluationRes.dto';

@ApiTags('lecture')
@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @ApiOperation({ summary: '강의 전체 조회' })
  @ApiResponse({ type: [ExpandedLectureResDto] })
  @Get()
  async getAll(): Promise<ExpandedLectureResDto[]> {
    return this.lectureService.getAll();
  }

  @ApiOperation({ summary: '강좌별 강의 평가 조회' })
  @ApiResponse({ type: EvaluationResDto })
  @Get('evaluation')
  async getEvaluation(
    @Query() query: EvaluationQueryDto,
  ): Promise<EvaluationResDto> {
    return this.lectureService.getEvaluation(query);
  }
}
