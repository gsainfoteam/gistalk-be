import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ExpandedLectureResDto } from 'src/lecture/dto/res/lectureRes.dto';
import { LectureRepository } from 'src/lecture/lecture.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('LectureRepository', () => {
  let lectureRepository: LectureRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LectureRepository,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaClient>(),
        },
      ],
    }).compile();

    lectureRepository = moduleRef.get<LectureRepository>(LectureRepository);
    mockPrisma = moduleRef.get(PrismaService);
  });

  describe('getAll', () => {
    it('should return a lecture list', async () => {
      mockPrisma.lecture.findMany.mockResolvedValue([]);
      expect(lectureRepository.getAll({})).resolves.toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return ExpandedLectureResDto with given lecture id', async () => {
      const lecture: ExpandedLectureResDto = {
        id: 1,
        name: 'name',
        LectureCode: [],
        LectureSection: [],
      };

      mockPrisma.lecture.findUniqueOrThrow.mockResolvedValue(lecture);

      const result = await lectureRepository.getOne(1);
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException when there is no such lecture id', async () => {
      mockPrisma.lecture.findUniqueOrThrow.mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'P2025',
          clientVersion: 'clientVersion',
        }),
      );
      expect(lectureRepository.getOne(99)).rejects.toThrow(
        new NotFoundException('Invalid ID'),
      );
    });

    it('should throw InternalServerErrorException when database error occurred', async () => {
      mockPrisma.lecture.findUniqueOrThrow.mockRejectedValue(
        new PrismaClientKnownRequestError('message', {
          code: 'not P2025',
          clientVersion: 'clientVersion',
        }),
      );
      expect(lectureRepository.getOne(1)).rejects.toThrow(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );
    });

    it('should throw INterServerErrorException when the thrown error is not PrismaClientKnownRequestError', async () => {
      mockPrisma.lecture.findUniqueOrThrow.mockRejectedValue(new Error());
      expect(lectureRepository.getOne(1)).rejects.toThrow(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );
    });
  });

  describe('getEvaluation', () => {
    it('should return average evaluation of specific lecture id if lecture id or section id is given', async () => {});
  });

  describe('search', () => {
    it('should return ExpandedLectureResDto whose lecture name contains keyword', async () => {
      const lecture = { id: 1, name: 'keyword word word' };
      mockPrisma.lecture.findMany.mockResolvedValue([lecture]);
      const result = await lectureRepository.search({ keyword: 'keyword' });
      expect(/keyword/.test(result[0].name)).toBe(true);
    });
  });
});
