import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { RecordRepository } from './record.repository';
import { Record, RecordLike, User } from '@prisma/client';
import { GetAllRecordQueryDto } from './dto/req/getAllRecordQuery.dto';
import { CreateRecordBodyDto } from './dto/req/createRecordBody.dto';
import { UpdateRecordBodyDto } from './dto/req/updateRecordBody.dto';
import { ExpandedRecordResDto } from './dto/res/expandedRes.dto';
import { ExpandedRecordType } from './types/ExpandedRecord.type';
import { RecordMapper } from './record.mapper';

@Injectable()
export class RecordService {
  constructor(
    private readonly recordRepository: RecordRepository,
    private readonly recordMapper: RecordMapper,
  ) {}

  async getRecordList(
    query: GetAllRecordQueryDto,
    user?: User,
  ): Promise<ExpandedRecordResDto[]> {
    let records: ExpandedRecordType[];
    switch (query.type) {
      case 'recent':
        records = await this.recordRepository.getRecentRecord(
          query,
          user?.uuid,
        );
        break;
      case 'user':
        if (!user || !user.uuid) {
          throw new BadRequestException('need login');
        }
        records = await this.recordRepository.getRecordByUser(query, user.uuid);
        break;
      case 'evaluation':
        if (!query.lectureId) {
          throw new BadRequestException('need lectureId');
        }
        records = await this.recordRepository.getRecordByLectureSection(query);
        break;
      default:
        throw new BadRequestException('invalid type');
    }
    return records.map((record) =>
      this.recordMapper.expandedRecordTypeToExpandedRecordResDto(record),
    );
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

  async createRecordLike(recordId: number, user: User): Promise<RecordLike> {
    const userRecordLike = await this.recordRepository.findUserRecordLike(
      recordId,
      user.uuid,
    );

    if (userRecordLike !== null) {
      throw new ConflictException('user already liked record');
    }

    return this.recordRepository.createRecordLike(recordId, user.uuid);
  }

  async removeRecordLike(recordId: number, user: User) {
    await this.recordRepository.deleteRecordLike(recordId, user.uuid);
  }
}
