import { Injectable } from '@nestjs/common';
import { ExpandedLectureResDto } from './dto/res/lectureRes.dto';
import { LectureRepository } from './lecture.repository';
import { EvaluationQueryDto } from './dto/req/evaluationReq.dto';
import { EvaluationResDto } from './dto/res/evaluationRes.dto';
import { Record } from '@prisma/client';
import { SearchLectureQueryDto } from './dto/req/searchReq.dto';
import { GetAllQueryDto } from './dto/req/getAllReq.dto';

@Injectable()
export class LectureService {
  constructor(private readonly lectureRepository: LectureRepository) {}

  async getAll(query: GetAllQueryDto): Promise<ExpandedLectureResDto[]> {
    return this.lectureRepository.getAll(query);
  }

  async getOne(id: number): Promise<ExpandedLectureResDto> {
    return this.lectureRepository.getOne(id);
  }

  async getEvaluation(query: EvaluationQueryDto): Promise<EvaluationResDto> {
    return this.lectureRepository.getEvaluation(query);
  }

  async getEvaluationDetail(query: EvaluationQueryDto): Promise<Record[]> {
    return this.lectureRepository.getEvaluationDetail(query);
  }

  async search(query: SearchLectureQueryDto): Promise<ExpandedLectureResDto[]> {
    return this.lectureRepository.search(query);
  }
}
