import { Injectable } from '@nestjs/common';
import { ExpandedLectureResDto } from './dto/res/lectureRes.dto';
import { LectureRepository } from './lecture.repository';
import { EvaluationQueryDto } from './dto/req/evaluationReq.dto';

@Injectable()
export class LectureService {
  constructor(private readonly lectureRepository: LectureRepository) {}

  async getAll(): Promise<ExpandedLectureResDto[]> {
    return this.lectureRepository.getAll();
  }

  async getEvaluation(query: EvaluationQueryDto): Promise<any> {
    return this.lectureRepository.getEvaluation(query);
  }
}
