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
import { SearchLectureQueryDto } from './dto/req/searchReq.dto';
import { GetAllQueryDto } from './dto/req/getAllReq.dto';

@Injectable()
export class LectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll({
    professorName,
  }: GetAllQueryDto): Promise<ExpandedLectureResDto[]> {
    return this.prismaService.lecture.findMany({
      where: {
        LectureSection: {
          some: {
            Professor: {
              some: {
                name: {
                  contains: professorName,
                },
              },
            },
          },
        },
      },
      include: {
        LectureCode: true,
        LectureSection: {
          include: {
            Professor: true,
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
          LectureSection: {
            include: {
              Professor: true,
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
    sectionId,
  }: EvaluationQueryDto): Promise<EvaluationResDto> {
    const evaluation = await this.prismaService.record.aggregate({
      where: {
        sectionId,
        LectureSection: {
          Lecture: {
            id: lectureId,
          },
        },
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

  async search({
    keyword,
  }: SearchLectureQueryDto): Promise<ExpandedLectureResDto[]> {
    return this.prismaService.lecture.findMany({
      where: {
        OR: [
          {
            name: {
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
        LectureSection: {
          include: {
            Professor: true,
          },
        },
      },
    });
  }
}
