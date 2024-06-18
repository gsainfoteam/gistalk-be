import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfessorService } from './professor.service';
import { LectureResDto } from './dto/res/lectureRes.dto';

@ApiTags('professor')
@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @ApiOperation({ summary: '교수별 개설 강좌 조회 API' })
  @Get(':id')
  async getProfessorInfo(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<LectureResDto[]> {
    return this.professorService.getProfessorInfo(id);
  }
}
