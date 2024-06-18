import { Controller, Get, Query } from '@nestjs/common';
import { RecordService } from './record.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecordResDto } from './dto/res/recordRes.dto';
import { GetAllRecordQueryDto } from './dto/req/getAllRecordQuery.dto';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @ApiOperation({
    summary: '강의평 조회',
    description:
      'type이 recent면 최근 강의평을, type이 evaluation이면, professorId와 lectureId가 있으면 해당 강의평을 조회합니다.',
  })
  @ApiResponse({ type: [RecordResDto] })
  @Get()
  async getRecordList(
    @Query() query: GetAllRecordQueryDto,
  ): Promise<RecordResDto[]> {
    return this.recordService.getRecordList(query);
  }
}
