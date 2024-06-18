import { Injectable } from '@nestjs/common';
import { Record } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagenationQueryDto } from './dto/req/pagenationQuery.dto';
import { GetAllRecordQueryDto } from './dto/req/getAllRecordQuery.dto';

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
}
