import { Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LectureRepository } from './lecture.repository';
import { UserModule } from 'src/user/user.module';
import { LectureMapper } from './lecture.mapper';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [LectureController],
  providers: [LectureService, LectureRepository, LectureMapper],
})
export class LectureModule {}
