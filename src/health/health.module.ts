import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TerminusModule.forRoot({ errorLogStyle: 'pretty' }),
    HttpModule,
    PrismaModule,
    ConfigModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
