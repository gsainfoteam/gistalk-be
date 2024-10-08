import { Injectable } from '@nestjs/common';
import { LectureRepository } from './lecture.repository';
import { EvaluationQueryDto } from './dto/req/evaluationReq.dto';
import { EvaluationResDto } from './dto/res/evaluationRes.dto';
import { SearchLectureQueryDto } from './dto/req/searchReq.dto';
import { GetAllQueryDto } from './dto/req/getAllReq.dto';
import { BookMarkQueryDto } from './dto/req/bookmarkReq.dto';
import { User } from '@prisma/client';
import { ExpandedLecture } from './types/expandedLecture.type';

@Injectable()
export class LectureService {
  constructor(private readonly lectureRepository: LectureRepository) {}

  async getAll(query: GetAllQueryDto): Promise<ExpandedLecture[]> {
    return this.lectureRepository.getAll(query);
  }

  async getOne(id: number): Promise<ExpandedLecture> {
    return this.lectureRepository.getOne(id);
  }

  async getEvaluation(query: EvaluationQueryDto): Promise<EvaluationResDto> {
    return this.lectureRepository.getEvaluation(query);
  }

  async search(query: SearchLectureQueryDto): Promise<ExpandedLecture[]> {
    return this.lectureRepository.search(query);
  }

  async addBookMark(query: BookMarkQueryDto, user: User) {
    return this.lectureRepository.addBookMark(query, user.uuid);
  }

  async deleteBookMark(query: BookMarkQueryDto, user: User) {
    return this.lectureRepository.deleteBookMark(query, user.uuid);
  }

  async getBookMark(user: User) {
    return this.lectureRepository.getBookMark(user.uuid);
  }
}
