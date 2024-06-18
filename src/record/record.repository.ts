import { Injectable } from '@nestjs/common';
import { Record } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagenationQueryDto } from './dto/req/pagenationQuery.dto';
import { GetAllRecordQueryDto } from './dto/req/getAllRecordQuery.dto';
import { CreateRecordBodyDto } from './dto/req/createRecordBody.dto';
import { UpdateRecordBodyDto } from './dto/req/updateRecordBoty.dto';

@Injectable()
export class RecordRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getRecentRecord({
    take,
    offset,
  }: PagenationQueryDto): Promise<Record[]> {
    return this.prismaService.record.findMany({
      skip: offset,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getRecordByLectureProfessor({
    lectureId,
    professorId,
    take,
    offset,
  }: Omit<GetAllRecordQueryDto, 'type'>): Promise<Record[]> {
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
}
