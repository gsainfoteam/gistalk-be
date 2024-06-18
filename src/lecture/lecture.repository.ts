import { Injectable } from '@nestjs/common';
import { Lecture } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LectureRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(): Promise<Lecture[]> {
    return this.prismaService.lecture.findMany({
      include: {
        LectureProfessor: {
          include: {
            professor: true,
          },
        },
      },
    });
  }
}
