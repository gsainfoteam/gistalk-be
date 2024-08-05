import { Injectable } from '@nestjs/common';
import { ExpandedLectureResDto } from './dto/res/lectureRes.dto';
import { LectureRepository } from './lecture.repository';
import { EvaluationQueryDto } from './dto/req/evaluationReq.dto';
import { EvaluationResDto } from './dto/res/evaluationRes.dto';
import { SearchLectureQueryDto } from './dto/req/searchReq.dto';
import { GetAllQueryDto } from './dto/req/getAllReq.dto';
import { BookMarkQueryDto } from './dto/req/bookmarkReq.dto';
import { User } from '@prisma/client';
import { LectureMapper } from './lecture.mapper';

@Injectable()
export class LectureService {
  constructor(
    private readonly lectureRepository: LectureRepository,
    private readonly lectureMapper: LectureMapper,
  ) {}

  async getAll(query: GetAllQueryDto): Promise<ExpandedLectureResDto[]> {
    const lectures = await this.lectureRepository.getAll(query);
    return lectures.map((lecture) =>
      this.lectureMapper.expandedLectureToExpandedLectureResDto(lecture),
    );
  }

  async getOne(id: number): Promise<ExpandedLectureResDto> {
    const lecture = await this.lectureRepository.getOne(id);
    return this.lectureMapper.expandedLectureToExpandedLectureResDto(lecture);
  }

  async getEvaluation(query: EvaluationQueryDto): Promise<EvaluationResDto> {
    return this.lectureRepository.getEvaluation(query);
  }

  async search(query: SearchLectureQueryDto): Promise<ExpandedLectureResDto[]> {
    const lectures = await this.lectureRepository.search(query);
    return lectures.map((lecture) =>
      this.lectureMapper.expandedLectureToExpandedLectureResDto(lecture),
    );
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
