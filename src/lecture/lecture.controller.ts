import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExpandedLectureResDto } from './dto/res/lectureRes.dto';
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LectureService } from './lecture.service';
import { EvaluationQueryDto } from './dto/req/evaluationReq.dto';
import { EvaluationResDto } from './dto/res/evaluationRes.dto';
import { GetAllQueryDto } from './dto/req/getAllReq.dto';
import { SearchLectureQueryDto } from './dto/req/searchReq.dto';
import { BookMarkQueryDto } from './dto/req/bookmarkReq.dto';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { BookMark, User } from '@prisma/client';
import { IdPGuard } from 'src/user/guard/idp.guard';

@ApiTags('lecture')
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
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
    return (await this.lectureService.getAll(query)).map((lecture) => {
      return new ExpandedLectureResDto(lecture);
    });
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
    return (await this.lectureService.search(query)).map((lecture) => {
      return new ExpandedLectureResDto(lecture);
    });
  }

  @ApiOperation({
    summary: '강좌별 강의 평균 점수 조회',
    description:
      'lecture Id만 넣으면 전체의 평균을, section Id도 같이 넣으면, section의 평균을 조회합니다.',
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
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ExpandedLectureResDto> {
    return new ExpandedLectureResDto(await this.lectureService.getOne(id));
  }

  @ApiOperation({
    summary: '북마크한 강의 조회',
    description: '북마크한 강의를 모두 조회합니다.',
  })
  @ApiOAuth2(['email', 'profile', 'openid'], 'oauth2')
  @UseGuards(IdPGuard)
  @Get('bookmark')
  async getBookMark(@GetUser() user: User): Promise<BookMark[]> {
    return this.lectureService.getBookMark(user!);
  }

  @ApiOperation({
    summary: '강의 북마크',
    description: '특정 강의 분반을 북마크합니다.',
  })
  @ApiOAuth2(['email', 'profile', 'openid'], 'oauth2')
  @UseGuards(IdPGuard)
  @Post('bookmark')
  async addBookMark(
    @Query() query: BookMarkQueryDto,
    @GetUser() user: User,
  ): Promise<BookMark> {
    return this.lectureService.addBookMark(query, user);
  }

  @ApiOperation({
    summary: '강의 북마크 취소',
    description: '특정 강의 분반의 북마크를 취소합니다.',
  })
  @ApiOAuth2(['email', 'profile', 'openid'], 'oauth2')
  @UseGuards(IdPGuard)
  @Delete('bookmark')
  async deleteBookMark(
    @Query() query: BookMarkQueryDto,
    @GetUser() user: User,
  ): Promise<BookMark> {
    return this.lectureService.deleteBookMark(query, user);
  }
}
