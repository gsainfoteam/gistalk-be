import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExpandedLectureResDto } from './dto/res/lectureRes.dto';
import { EvaluationQueryDto } from './dto/req/evaluationReq.dto';
import { EvaluationResDto } from './dto/res/evaluationRes.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Record } from '@prisma/client';
import { SearchQueryDto } from './dto/req/searchReq.dto';
import { GetAllQueryDto } from './dto/req/getAllReq.dto';

@Injectable()
export class LectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll({
    professorName,
  }: GetAllQueryDto): Promise<ExpandedLectureResDto[]> {
    return this.prismaService.lecture.findMany({
      where: {
        ...(professorName
          ? {
              LectureProfessor: {
                some: {
                  professor: {
                    name: {
                      contains: professorName,
                    },
                  },
                },
              },
            }
          : {}),
      },
      include: {
        LectureCode: true,
        LectureProfessor: {
          include: {
            professor: true,
          },
        },
      },
    });
  }

  async getOne(id: number): Promise<ExpandedLectureResDto> {
    return this.prismaService.lecture
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          LectureCode: true,
          LectureProfessor: {
            include: {
              professor: true,
            },
          },
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException('Invalid ID');
          }
          throw new InternalServerErrorException(
            'Unexpected Database Error Occurred',
          );
        }
        throw new InternalServerErrorException('Unexpected Error Occurred');
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

  async getEvaluationDetail({
    lectureId,
    professorId,
  }: EvaluationQueryDto): Promise<Record[]> {
    return this.prismaService.record.findMany({
      where: { lectureId, professorId },
    });
  }

  async search({ keyword }: SearchQueryDto): Promise<ExpandedLectureResDto[]> {
    return this.prismaService.lecture.findMany({
      where: {
        OR: [
          {
            lectureName: {
              contains: keyword,
            },
          },
          {
            LectureCode: {
              some: {
                code: {
                  contains: keyword,
                },
              },
            },
          },
        ],
      },
      include: {
        LectureCode: true,
        LectureProfessor: {
          include: {
            professor: true,
          },
        },
      },
    });
  }
}
