import { Injectable } from '@nestjs/common';
import { ProfessorRepository } from './professor.repository';

@Injectable()
export class ProfessorService {
  constructor(private readonly professorRepository: ProfessorRepository) {}

  async getProfessorInfo(id: number) {
    return this.professorRepository.findProfessorLecture(id);
  }
}
