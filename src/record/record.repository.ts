import { Injectable } from '@nestjs/common';
import { Record, RecordLike } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagenationQueryDto } from './dto/req/pagenationQuery.dto';
import { GetAllRecordQueryDto } from './dto/req/getAllRecordQuery.dto';
import { CreateRecordBodyDto } from './dto/req/createRecordBody.dto';
import { UpdateRecordBodyDto } from './dto/req/updateRecordBoty.dto';
import { ExpandedRecordType } from './types/ExpandedRecord.type';

@Injectable()
export class RecordRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getRecentRecord({
    take,
    offset,
  }: PagenationQueryDto): Promise<ExpandedRecordType[]> {
    return this.prismaService.record.findMany({
      skip: offset,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        lectureProfessor: {
          include: {
            lecture: true,
            professor: true,
          },
        },
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
        lectureProfessor: {
          include: {
            lecture: true,
            professor: true,
          },
        },
      },
    });
  }

  async getRecordByLectureProfessor({
    lectureId,
    professorId,
    take,
    offset,
  }: Omit<GetAllRecordQueryDto, 'type'>): Promise<ExpandedRecordType[]> {
    return this.prismaService.record.findMany({
      where: {
        lectureId,
        professorId,
      },
      skip: offset,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        lectureProfessor: {
          include: {
            lecture: true,
            professor: true,
          },
        },
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
      lectureId,
      professorId,
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
        lectureId,
        professorId,
        userUuid,
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

  async findRecordLike(recordId: number): Promise<RecordLike[]> {
    return this.prismaService.recordLike.findMany({
      where: {
        recordId: recordId,
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
