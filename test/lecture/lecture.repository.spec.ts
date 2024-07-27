import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BookMark, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { BookMarkQueryDto } from 'src/lecture/dto/req/bookmarkReq.dto';
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
      mockPrisma.lecture.findMany.mockResolvedValueOnce([]);
      expect(lectureRepository.getAll({})).resolves.toBeInstanceOf(Array);
    });

    it('should throw InternalServerErrorException when mockPrisma.findMany throws PrismaClientKnownRequestError', async () => {
      mockPrisma.lecture.findMany.mockRejectedValue(
        new PrismaClientKnownRequestError(
          'Unexpected Database Error Occurred',
          {
            code: 'code',
            clientVersion: 'clientVersion',
          },
        ),
      );
      expect(
        lectureRepository.getAll({ professorName: 'something' }),
      ).rejects.toThrow(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );
    });

    it('should throw InternalServerErrorException when mockPrisma.findMany throws error which is not PrismaClientKnownRequestError', async () => {
      mockPrisma.lecture.findMany.mockRejectedValue(
        new Error('Unexpected Error Occurred'),
      );

      expect(
        lectureRepository.getAll({ professorName: 'something' }),
      ).rejects.toThrow(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );
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
        new PrismaClientKnownRequestError('Invalid ID', {
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
        new PrismaClientKnownRequestError(
          'Unexpected Database Error Occurred',
          {
            code: 'not P2025',
            clientVersion: 'clientVersion',
          },
        ),
      );
      expect(lectureRepository.getOne(1)).rejects.toThrow(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );
    });

    it('should throw INterServerErrorException when the thrown error is not PrismaClientKnownRequestError', async () => {
      mockPrisma.lecture.findUniqueOrThrow.mockRejectedValue(
        new Error('Unexpected Error Occurred'),
      );

      expect(lectureRepository.getOne(1)).rejects.toThrow(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );
    });
  });

  describe('getEvaluation', () => {
    it('should return average evaluation of specific lecture id if lecture id or section id is given', async () => {
      mockPrisma.record.aggregate.mockResolvedValue({
        _avg: {
          difficulty: 1,
          skill: 1,
          helpfulness: 1,
          interest: 1,
          load: 1,
          generosity: 1,
        },
        _sum: {},
        _count: {},
        _max: {},
        _min: {},
      });

      expect(
        await lectureRepository.getEvaluation({ lectureId: 1, sectionId: 1 }),
      ).toEqual({
        difficulty: 1,
        skill: 1,
        helpfulness: 1,
        interest: 1,
        load: 1,
        generosity: 1,
      });
    });

    it('should throw InternalServerErrorException when mockPrisma.record.aggregate throw PrismaClientKnownRequestError', async () => {
      mockPrisma.record.aggregate.mockRejectedValue(
        new PrismaClientKnownRequestError(
          'Unexpected Database Error Occurred',
          { code: 'code', clientVersion: 'clientVersion' },
        ),
      );

      expect(
        lectureRepository.getEvaluation({ lectureId: 1, sectionId: 1 }),
      ).rejects.toThrow(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );
    });

    it('should throw InternalServerErrorException when mockPrisma.record.aggregate throw err which is not PrismaClientKnownRequestError', async () => {
      mockPrisma.record.aggregate.mockRejectedValue(
        new Error('Unexpected Error Occurred'),
      );

      expect(
        lectureRepository.getEvaluation({ lectureId: 1, sectionId: 1 }),
      ).rejects.toThrow(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );
    });
  });

  describe('search', () => {
    it('should return ExpandedLectureResDto whose lecture name contains keyword', async () => {
      const lecture = { id: 1, name: 'keyword word word' };
      mockPrisma.lecture.findMany.mockResolvedValue([lecture]);
      const result = await lectureRepository.search({ keyword: 'keyword' });
      expect(/keyword/.test(result[0].name)).toBe(true);
    });
  });
  it('should throw InternalServerErrorException when mockPrisma.lecture.search throw PrismaClientKnownRequestError', async () => {
    mockPrisma.lecture.findMany.mockRejectedValue(
      new PrismaClientKnownRequestError('Unexpected Database Error Occurred', {
        code: 'code',
        clientVersion: 'clientVersion',
      }),
    );

    expect(lectureRepository.search({ keyword: 'keyword' })).rejects.toThrow(
      new InternalServerErrorException('Unexpected Database Error Occurred'),
    );
  });

  it('should throw InternalServerErrorException when mockPrisma.lecture.search throw err which is not PrismaClientKnownRequestError', async () => {
    mockPrisma.lecture.findMany.mockRejectedValue(
      new Error('Unexpected Error Occurred'),
    );

    expect(lectureRepository.search({ keyword: 'keyword' })).rejects.toThrow(
      new InternalServerErrorException('Unexpected Error Occurred'),
    );
  });

  describe('addBookMark', () => {
    const mockReq: BookMarkQueryDto = {
      lectureId: 1,
      sectionId: 5,
    };
    const userUuid = 'uuid';

    it('should create bookmark', async () => {
      const lectureId = 1;
      const sectionId = 5;
      const expectedResult: BookMark = {
        lectureId,
        sectionId,
        userUuid,
      };

      mockPrisma.bookMark.create.mockResolvedValue(expectedResult);

      const result = await lectureRepository.addBookMark(mockReq, userUuid);

      expect(result).toBeDefined();
      expect(result.lectureId).toBe(lectureId);
      expect(result.sectionId).toBe(sectionId);
      expect(result.userUuid).toBe(userUuid);
    });

    it('should throw InternalServerErrorException when mockPrisma.addBookMark throws Unexpected Database Error', async () => {
      mockPrisma.bookMark.create.mockRejectedValue(
        new PrismaClientKnownRequestError(
          'Unexpected Database Error Occurred',
          {
            code: 'code',
            clientVersion: 'clientVersion',
          },
        ),
      );

      const result = lectureRepository.addBookMark(mockReq, userUuid);

      expect(result).rejects.toThrow(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );
    });

    it('should throw InternalServerErrorException when mockPrisma.addBookMark throws Error which is not PrismaKnownRequestErro', async () => {
      mockPrisma.bookMark.create.mockRejectedValue(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );

      const result = lectureRepository.addBookMark(mockReq, userUuid);

      expect(result).rejects.toThrow(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );
    });
  });

  describe('deleteBookMark', () => {
    const mockQuery: BookMarkQueryDto = {
      lectureId: 1,
      sectionId: 5,
    };
    const userUuid = 'uuid';

    it('should delete BookMark', async () => {
      const lectureId = 1;
      const sectionId = 5;
      const expectedResult: BookMark = {
        lectureId,
        sectionId,
        userUuid,
      };

      mockPrisma.bookMark.delete.mockResolvedValue(expectedResult);

      const result = await lectureRepository.deleteBookMark(
        mockQuery,
        userUuid,
      );

      expect(result).toBeDefined();
      expect(result.lectureId).toBe(lectureId);
      expect(result.sectionId).toBe(sectionId);
      expect(result.userUuid).toBe(userUuid);
    });

    it('should throw NotFoundException when mockPrisma.deleteBookMark throws PrismaKnownRequestError with code P2025', async () => {
      mockPrisma.bookMark.delete.mockRejectedValue(
        new PrismaClientKnownRequestError('No Such BookMark', {
          code: 'P2025',
          clientVersion: 'clientVersion',
        }),
      );

      const result = lectureRepository.deleteBookMark(mockQuery, userUuid);

      expect(result).rejects.toThrow(new NotFoundException('No Such BookMark'));
    });

    it('should throw InterServerErrorException when mockPrisma.deleteBookMark throws PrismaKnownRequestError but unexpected', async () => {
      mockPrisma.bookMark.delete.mockRejectedValue(
        new PrismaClientKnownRequestError(
          'Unexpected Database Error Occurred',
          {
            code: 'code',
            clientVersion: 'clientVersion',
          },
        ),
      );

      const result = lectureRepository.deleteBookMark(mockQuery, userUuid);

      expect(result).rejects.toThrow(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );
    });

    it('should throw InternalServerErrorException when mockPrisma.deleteBookMark throws Error which is not PrismaClientKnownRequestError', async () => {
      mockPrisma.bookMark.delete.mockRejectedValue(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );

      const result = lectureRepository.deleteBookMark(mockQuery, userUuid);

      expect(result).rejects.toThrow(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );
    });
  });

  describe('getBookMark', () => {
    it('should return All bookmarks with userUuid', async () => {
      const userUuid = 'uuid';
      const expectedResult: BookMark[] = [
        {
          lectureId: 1,
          sectionId: 5,
          userUuid: 'uuid',
        },
        {
          lectureId: 2,
          sectionId: 1,
          userUuid: 'uuid',
        },
      ];

      mockPrisma.bookMark.findMany.mockResolvedValue(expectedResult);

      const result = await lectureRepository.getBookMark(userUuid);

      expect(result).toBeDefined();
      expect(result[0].lectureId).toBe(expectedResult[0].lectureId);
      expect(result[0].sectionId).toBe(expectedResult[0].sectionId);
      expect(result[0].userUuid).toBe(expectedResult[0].userUuid);
      expect(result[1].lectureId).toBe(expectedResult[1].lectureId);
      expect(result[1].sectionId).toBe(expectedResult[1].sectionId);
      expect(result[1].userUuid).toBe(expectedResult[1].userUuid);
    });

    it('should throw NotFoundException when mockPrisma.getBookMark throws PrismaClientRequestError with code P2025', async () => {
      const userUuid = 'uuid';
      mockPrisma.bookMark.findMany.mockRejectedValue(
        new PrismaClientKnownRequestError('Invalid ID', {
          code: 'P2025',
          clientVersion: 'clientVersion',
        }),
      );

      const result = lectureRepository.getBookMark(userUuid);

      expect(result).rejects.toThrow(new NotFoundException('Invalid ID'));
    });

    it('should throw InteranlServerErrorException when mockPrisma.getBookMark throws Unexpected PrismaClientRequest', async () => {
      const userUuid = 'uuid';
      mockPrisma.bookMark.findMany.mockRejectedValue(
        new PrismaClientKnownRequestError(
          'Unexpected Database Error Occurred',
          {
            code: 'code',
            clientVersion: 'clientVersion',
          },
        ),
      );

      const result = lectureRepository.getBookMark(userUuid);

      expect(result).rejects.toThrow(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );
    });

    it('should throw InternalServerErrorException when mockPrisma.getBookMark throws Error which is not PrismaClientKnownRequestError', async () => {
      const userUuid = 'uuid';
      mockPrisma.bookMark.findMany.mockRejectedValue(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );

      const result = lectureRepository.getBookMark(userUuid);

      expect(result).rejects.toThrow(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );
    });
  });
});
