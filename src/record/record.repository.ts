import { Injectable } from '@nestjs/common';
import { Record } from '@prisma/client';
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
    sectionId,
    professorId,
    take,
    offset,
  }: Omit<GetAllRecordQueryDto, 'type'>): Promise<ExpandedRecordType[]> {
    return this.prismaService.record.findMany({
      where: {
        section: {
          where: {
            lectureId,
          },
        },
        sectionId,
        professorId,
      },
      skip: offset,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        lectureSection: {
          include: {
            lecture: true,
            lectureSectionProfessor: true,
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
