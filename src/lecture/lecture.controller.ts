import { Controller, Get } from '@nestjs/common';
import { LectureResDto } from './dto/res/lectureRes.dto';

@Controller('lecture')
export class LectureController {
  @Get()
  async getAll(): Promise<LectureResDto[]> {
    return [];
  }
}
