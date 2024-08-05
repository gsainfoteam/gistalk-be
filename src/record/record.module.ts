import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecordRepository } from './record.repository';
import { UserModule } from 'src/user/user.module';
import { RecordMapper } from './record.mapper';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [RecordController],
  providers: [RecordService, RecordRepository, RecordMapper],
})
export class RecordModule {}
