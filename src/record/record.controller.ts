import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecordResDto } from './dto/res/recordRes.dto';
import { GetAllRecordQueryDto } from './dto/req/getAllRecordQuery.dto';
import { IdPGuard } from 'src/user/guard/idp.guard';
import { CreateRecordBodyDto } from './dto/req/createRecordBody.dto';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { User } from '@prisma/client';
import { UpdateRecordBodyDto } from './dto/req/updateRecordBoty.dto';
import { ExpandedRecordResDto } from './dto/res/expandedRes.dto';

@ApiTags('record')
@Controller('record')
@UsePipes(new ValidationPipe({ transform: true }))
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
  ): Promise<ExpandedRecordResDto[]> {
    return this.recordService.getRecordList(query);
  }

  @ApiOperation({
    summary: '강의평 생성',
    description: '강의평을 생성합니다.',
  })
  @ApiOAuth2(['email', 'profile', 'openid'], 'oauth2')
  @ApiResponse({ type: RecordResDto })
  @UseGuards(IdPGuard)
  @Post()
  async createRecord(
    @Body() body: CreateRecordBodyDto,
    @GetUser() user: User,
  ): Promise<RecordResDto> {
    return this.recordService.createRecord(body, user);
  }

  @ApiOperation({
    summary: '강의평 수정',
    description: '강의평을 수정합니다.',
  })
  @ApiOAuth2(['email', 'profile', 'openid'], 'oauth2')
  @ApiResponse({ type: RecordResDto })
  @UseGuards(IdPGuard)
  @Patch(':id')
  async updateRecord(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateRecordBodyDto,
    @GetUser() user: User,
  ): Promise<RecordResDto> {
    return this.recordService.updateRecord(body, id, user);
  }
}
