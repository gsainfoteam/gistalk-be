import { BadRequestException, Injectable } from '@nestjs/common';
import { RecordRepository } from './record.repository';
import { Record } from '@prisma/client';
import { GetAllRecordQueryDto } from './dto/req/getAllRecordQuery.dto';

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
}
