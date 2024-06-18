import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ProfessorModule } from './professor/professor.module';
import { UserModule } from './user/user.module';
import { LectureModule } from './lecture/lecture.module';
import { RecordModule } from './record/record.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProfessorModule,
    UserModule,
    LectureModule,
    RecordModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
