import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LectureRepository } from './lecture.repository';

@Module({
  imports: [PrismaModule],
  controllers: [LectureController],
  providers: [LectureService, LectureRepository],
})
export class LectureModule {}
