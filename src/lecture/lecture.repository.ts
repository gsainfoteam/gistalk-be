import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EvaluationQueryDto } from './dto/req/evaluationReq.dto';
import { EvaluationResDto } from './dto/res/evaluationRes.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SearchLectureQueryDto } from './dto/req/searchReq.dto';
import { GetAllQueryDto } from './dto/req/getAllReq.dto';
import { BookMarkQueryDto } from './dto/req/bookmarkReq.dto';
import { BookMark } from '@prisma/client';
import { ExpandedLecture } from './types/expandedLecture.type';

@Injectable()
export class LectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll({ professorName }: GetAllQueryDto): Promise<ExpandedLecture[]> {
    return this.prismaService.lecture
      .findMany({
        where: {
          LectureSection: {
            some: {
              LectureSectionProfessor: {
                some: {
                  Professor: {
                    name: {
                      contains: professorName,
                    },
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
              LectureSectionProfessor: {
                include: {
                  Professor: true,
                },
              },
            },
          },
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException(
            'Unexpected Database Error Occurred',
          );
        }
        throw new InternalServerErrorException('Unexpected Error Occurred');
      });
  }

  async getOne(id: number): Promise<ExpandedLecture> {
    return this.prismaService.lecture
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          LectureCode: true,
          LectureSection: {
            include: {
              LectureSectionProfessor: {
                include: {
                  Professor: true,
                },
              },
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
    const evaluation = await this.prismaService.record
      .aggregate({
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
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException(
            'Unexpected Database Error Occurred',
          );
        }
        throw new InternalServerErrorException('Unexpected Error Occurred');
      });

    return evaluation._avg;
  }

  async search({ keyword }: SearchLectureQueryDto): Promise<ExpandedLecture[]> {
    return this.prismaService.lecture
      .findMany({
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
              LectureSectionProfessor: {
                include: {
                  Professor: true,
                },
              },
            },
          },
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException(
            'Unexpected Database Error Occurred',
          );
        }
        throw new InternalServerErrorException('Unexpected Error Occurred');
      });
  }

  async addBookMark(
    { lectureId, sectionId, year, semester }: BookMarkQueryDto,
    userUuid: string,
  ): Promise<BookMark> {
    return this.prismaService.bookMark
      .create({
        data: {
          lectureId,
          sectionId,
          year,
          semester,
          userUuid,
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2025') throw new NotFoundException('invalid ID');
          throw new InternalServerErrorException(
            'Unexpected Database Error Occurred',
          );
        }
        throw new InternalServerErrorException('Unexpected Error Occurred');
      });
  }

  async deleteBookMark(
    { lectureId, sectionId }: BookMarkQueryDto,
    userUuid: string,
  ): Promise<BookMark> {
    return this.prismaService.bookMark
      .delete({
        where: {
          lectureId_sectionId_userUuid: {
            sectionId,
            lectureId,
            userUuid,
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

  async getBookMark(userUuid: string): Promise<BookMark[]> {
    return this.prismaService.bookMark
      .findMany({
        where: {
          userUuid,
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2025') throw new NotFoundException('Invalid ID');
          throw new InternalServerErrorException(
            'Unexpected Database Error Occurred',
          );
        }
        throw new InternalServerErrorException('Unexpected Error Occurred');
      });
  }
}
