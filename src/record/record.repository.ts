import { Injectable } from '@nestjs/common';
import { Record, RecordLike } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagenationQueryDto } from './dto/req/pagenationQuery.dto';
import { GetAllRecordQueryDto } from './dto/req/getAllRecordQuery.dto';
import { CreateRecordBodyDto } from './dto/req/createRecordBody.dto';
import { UpdateRecordBodyDto } from './dto/req/updateRecordBody.dto';
import { ExpandedRecordType } from './types/ExpandedRecord.type';

@Injectable()
export class RecordRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getRecentRecord(
    { take, offset }: PagenationQueryDto,
    userUuid?: string,
  ): Promise<ExpandedRecordType[]> {
    return this.prismaService.record.findMany({
      skip: offset,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        LectureSection: {
          include: {
            Lecture: true,
            LectureSectionProfessor: {
              include: {
                Professor: true,
              },
            },
          },
        },
        RecordLike: userUuid
          ? {
              where: {
                userUuid,
                deletedAt: null,
              },
            }
          : false,
      },
    });
  }

  async getRecordByUser(
    { take, offset }: PagenationQueryDto,
    userUuid: string,
  ): Promise<ExpandedRecordType[]> {
    return this.prismaService.record.findMany({
      skip: offset,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userUuid,
      },
      include: {
        LectureSection: {
          include: {
            Lecture: true,
            LectureSectionProfessor: {
              include: {
                Professor: true,
              },
            },
          },
        },
        RecordLike: {
          where: {
            userUuid,
            deletedAt: null,
          },
        },
      },
    });
  }

  async getRecordByLectureSection(
    { lectureId, sectionId, take, offset }: Omit<GetAllRecordQueryDto, 'type'>,
    userUuid?: string,
  ): Promise<ExpandedRecordType[]> {
    return this.prismaService.record.findMany({
      where: {
        sectionId,
        LectureSection: {
          id: sectionId,
          lectureId,
        },
      },
      skip: offset,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        LectureSection: {
          include: {
            Lecture: true,
            LectureSectionProfessor: {
              include: {
                Professor: true,
              },
            },
          },
        },
        RecordLike: userUuid
          ? {
              where: {
                userUuid,
                deletedAt: null,
              },
            }
          : false,
        _count: {
          select: {
            RecordLike: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });
  }

  async createRecord(
    {
      difficulty,
      skill,
      helpfulness,
      interest,
      load,
      generosity,
      review,
      recommendation,
      semester,
      year,
      sectionId,
      lectureId,
    }: CreateRecordBodyDto,
    userUuid: string,
  ): Promise<Record> {
    return this.prismaService.record.create({
      data: {
        difficulty,
        skill,
        helpfulness,
        interest,
        load,
        generosity,
        review,
        recommendation,
        semester,
        year,
        userUuid,
        sectionId,
        lectureId,
      },
    });
  }

  async updateRecord(
    {
      difficulty,
      skill,
      helpfulness,
      interest,
      load,
      generosity,
      review,
      recommendation,
      semester,
      year,
    }: UpdateRecordBodyDto,
    id: number,
    userUuid: string,
  ): Promise<Record> {
    return this.prismaService.record.update({
      where: {
        id,
        userUuid,
      },
      data: {
        difficulty,
        skill,
        helpfulness,
        interest,
        load,
        generosity,
        review,
        recommendation,
        semester,
        year,
      },
    });
  }

  async createRecordLike(
    recordId: number,
    userUuid: string,
  ): Promise<RecordLike> {
    return this.prismaService.recordLike.create({
      data: {
        recordId,
        userUuid,
      },
    });
  }

  async findUserRecordLike(
    recordId: number,
    userUuid: string,
  ): Promise<RecordLike | null> {
    return this.prismaService.recordLike.findFirst({
      where: {
        recordId: recordId,
        userUuid: userUuid,
        deletedAt: null,
      },
    });
  }

  async deleteRecordLike(recordId: number, userUuid: string) {
    await this.prismaService.recordLike.updateMany({
      where: {
        recordId: recordId,
        userUuid: userUuid,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }
}
