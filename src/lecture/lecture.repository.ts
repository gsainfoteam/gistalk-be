import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExpandedLectureResDto } from './dto/res/lectureRes.dto';
import { EvaluationQueryDto } from './dto/req/evaluationReq.dto';
import { EvaluationResDto } from './dto/res/evaluationRes.dto';

@Injectable()
export class LectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<ExpandedLectureResDto[]> {
    return this.prismaService.lecture.findMany({
      include: {
        LectureProfessor: {
          include: {
            professor: true,
          },
        },
      },
    });
  }

  async getEvaluation({
    lectureId,
    professorId,
  }: EvaluationQueryDto): Promise<EvaluationResDto> {
    const evaluation = await this.prismaService.record.aggregate({
      where: {
        lectureId,
        professorId,
      },
      _avg: {
        difficulty: true,
        skill: true,
        helpfulness: true,
        interest: true,
        load: true,
        generosity: true,
      },
    });

    return evaluation._avg;
  }
}
