import { BadRequestException, Injectable } from '@nestjs/common';
import { RecordRepository } from './record.repository';
import { Record, User } from '@prisma/client';
import { GetAllRecordQueryDto } from './dto/req/getAllRecordQuery.dto';
import { CreateRecordBodyDto } from './dto/req/createRecordBody.dto';
import { UpdateRecordBodyDto } from './dto/req/updateRecordBoty.dto';

@Injectable()
export class RecordService {
  constructor(private readonly recordRepository: RecordRepository) {}

  async getRecordList(query: GetAllRecordQueryDto): Promise<Record[]> {
    if (query.type === 'recent') {
      return this.recordRepository.getRecentRecord(query);
    }
    if (!query.professorId || !query.lectureId) {
      throw new BadRequestException('need professorId and lectureId');
    }
    return this.recordRepository.getRecordByLectureProfessor(query);
  }

  async createRecord(body: CreateRecordBodyDto, user: User): Promise<Record> {
    return this.recordRepository.createRecord(body, user.uuid);
  }

  async updateRecord(
    body: UpdateRecordBodyDto,
    id: number,
    user: User,
  ): Promise<Record> {
    return this.recordRepository.updateRecord(body, id, user.uuid);
  }
}
