import { Injectable } from '@nestjs/common';
import { Record } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagenationQueryDto } from './dto/req/pagenationQuery.dto';
import { GetAllRecordQueryDto } from './dto/req/getAllRecordQuery.dto';
import { CreateRecordBodyDto } from './dto/req/createRecordBody.dto';
import { UpdateRecordBodyDto } from './dto/req/updateRecordBody.dto';
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
        LectureSection: {
          include: {
            Lecture: true,
            Professor: true,
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
        LectureSection: {
          include: {
            Lecture: true,
            Professor: true,
          },
        },
      },
    });
  }

  async getRecordByLectureSection({
    lectureId,
    sectionId,
    take,
    offset,
  }: Omit<GetAllRecordQueryDto, 'type'>): Promise<ExpandedRecordType[]> {
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
            Professor: true,
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
}
