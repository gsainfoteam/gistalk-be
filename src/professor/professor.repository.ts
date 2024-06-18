import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfessorRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findProfessorLecture(id: number) {
    return this.prismaService.lecture
      .findMany({
        where: {
          LectureProfessor: {
            some: {
              professorId: id,
            },
          },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException(error.message);
        }
        throw new InternalServerErrorException('Unexpected error occurred');
      });
  }
}
