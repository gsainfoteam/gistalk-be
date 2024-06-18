import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecordRepository } from './record.repository';

@Module({
  imports: [PrismaModule],
  controllers: [RecordController],
  providers: [RecordService, RecordRepository],
})
export class RecordModule {}
