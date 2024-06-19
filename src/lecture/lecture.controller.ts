import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExpandedLectureResDto } from './dto/res/lectureRes.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LectureService } from './lecture.service';
import { EvaluationQueryDto } from './dto/req/evaluationReq.dto';
import { EvaluationResDto } from './dto/res/evaluationRes.dto';
import { GetAllQueryDto } from './dto/req/getAllReq.dto';
import { SearchLectureQueryDto } from './dto/req/searchReq.dto';
@ApiTags('lecture')
@UsePipes(ValidationPipe)
@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @ApiOperation({
    summary: '강의 전체 조회',
    description:
      '모든 공지 조회, 만약 교수이름을 넣을 시에는 교수이름에 따른 공지 조회',
  })
  @ApiResponse({ type: [ExpandedLectureResDto] })
  @Get()
  async getAll(
    @Query() query: GetAllQueryDto,
  ): Promise<ExpandedLectureResDto[]> {
    return this.lectureService.getAll(query);
  }

  @ApiOperation({
    summary: '강의 검색',
    description: '강의 이름이나 코드로 검색합니다.',
  })
  @ApiResponse({ type: [ExpandedLectureResDto] })
  @Get('search')
  async search(
    @Query() query: SearchLectureQueryDto,
  ): Promise<ExpandedLectureResDto[]> {
    return this.lectureService.search(query);
  }

  @ApiOperation({
    summary: '강좌별 강의 평균 점수 조회',
    description:
      '강의 Id만 넣으면 전체의 평균을, 교수 Id도 같이 넣으면, 해당 교수의 평균을 조회합니다.',
  })
  @ApiResponse({ type: EvaluationResDto })
  @Get('evaluation')
  async getEvaluation(
    @Query() query: EvaluationQueryDto,
  ): Promise<EvaluationResDto> {
    return this.lectureService.getEvaluation(query);
  }

  @ApiOperation({ summary: '각 강좌의 기본 정보 + 교수 정보 조회' })
  @ApiResponse({ type: ExpandedLectureResDto })
  @Get(':id')
  async getOne(
    @Query('id', new ParseIntPipe()) id: number,
  ): Promise<ExpandedLectureResDto> {
    return this.lectureService.getOne(id);
  }
}
