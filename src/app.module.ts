import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ProfessorController } from './professor/professor.controller';
import { ProfessorModule } from './professor/professor.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProfessorModule,
    UserModule,
  ],
  controllers: [AppController, ProfessorController],
})
export class AppModule {}
