import { Injectable } from '@nestjs/common';
import { ProfessorRepository } from './professor.repository';
import { Lecture } from '@prisma/client';

@Injectable()
export class ProfessorService {
  constructor(private readonly professorRepository: ProfessorRepository) {}

  async getProfessorInfo(id: number): Promise<Lecture[]> {
    return this.professorRepository.findProfessorLecture(id);
  }
}
