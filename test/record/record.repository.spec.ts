import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient, RecordLike } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { InternalServerErrorException } from '@nestjs/common';
import { RecordRepository } from '../../src/record/record.repository';
import { PagenationQueryDto } from '../../src/record/dto/req/pagenationQuery.dto';
import { ExpandedRecordType } from '../../src/record/types/ExpandedRecord.type';
import { GetAllRecordQueryDto } from '../../src/record/dto/req/getAllRecordQuery.dto';
import { CreateRecordBodyDto } from '../../src/record/dto/req/createRecordBody.dto';
import { RecordResDto } from '../../src/record/dto/res/recordRes.dto';
import { UpdateRecordBodyDto } from '../../src/record/dto/req/updateRecordBody.dto';

describe('RecordRepository', () => {
  let repository: RecordRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      providers: [
        RecordRepository,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    repository = mockModule.get<RecordRepository>(RecordRepository);
    mockPrisma = mockModule.get(PrismaService);
  });

  describe('getRecentRecord', () => {
    it('should be defined', () => {
      expect(repository.getRecentRecord).toBeDefined();
    });

    const query: PagenationQueryDto = {
      take: 10,
      offset: 0,
    };

    const recentRecords: ExpandedRecordType[] = [
      {
        id: 1,
        difficulty: 1,
        skill: 5,
        helpfulness: 4,
        interest: 4,
        load: 1,
        generosity: 5,
        review: 'review',
        recommendation: 'MAYBE',
        semester: 'FALL',
        year: 2022,
        createdAt: new Date(),
        sectionId: 26,
        userUuid: 'uuid',
        lectureId: 253,
        LectureSection: {
          id: 26,
          lectureId: 253,
          year: 2022,
          semester: 'FALL',
          capacity: 0,
          registrationCount: null,
          fullCapacityTime: null,
          Lecture: {
            id: 253,
            name: 'name',
          },
          LectureSectionProfessor: [
            {
              sectionId: 26,
              lectureId: 253,
              year: 2022,
              semester: 'FALL',
              professorId: 9,
              Professor: {
                id: 9,
                name: 'name',
              },
            },
          ],
        },
      },
    ];

    it('should find recent record if exists', async () => {
      mockPrisma.record.findMany.mockResolvedValue(recentRecords);
      expect(await repository.getRecentRecord(query)).toBe(recentRecords);
    });

    it('should throw internalServerException if findMany fails with database error', async () => {
      mockPrisma.record.findMany.mockRejectedValue(
        new PrismaClientKnownRequestError('database error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.getRecentRecord(query)).rejects.toThrow(
        new InternalServerErrorException('database error'),
      );
    });

    it('should throw internalServerException if findMany fails with unexpected error', async () => {
      mockPrisma.record.findMany.mockRejectedValue(
        new Error('unexpected error'),
      );
      await expect(repository.getRecentRecord(query)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });

  describe('getRecordByUser', () => {
    it('should be defined', () => {
      expect(repository.getRecordByUser).toBeDefined();
    });

    const query: PagenationQueryDto = {
      take: 10,
      offset: 0,
    };

    const userUuid: string = 'uuid';

    const userRecords: ExpandedRecordType[] = [
      {
        id: 2,
        difficulty: 1,
        skill: 1,
        helpfulness: 1,
        interest: 1,
        load: 1,
        generosity: 1,
        review: 'reviewreviewreviewreview',
        recommendation: 'YES',
        semester: 'SPRING',
        year: 2021,
        createdAt: new Date(),
        sectionId: 26,
        userUuid: 'uuid',
        lectureId: 253,
        LectureSection: {
          id: 26,
          lectureId: 253,
          year: 2021,
          semester: 'SPRING',
          capacity: 0,
          registrationCount: null,
          fullCapacityTime: null,
          Lecture: {
            id: 253,
            name: 'name',
          },
          LectureSectionProfessor: [
            {
              sectionId: 26,
              lectureId: 253,
              year: 2021,
              semester: 'SPRING',
              professorId: 9,
              Professor: { id: 9, name: 'name' },
            },
          ],
        },
      },
    ];

    it('should find record by user if exists', async () => {
      mockPrisma.record.findMany.mockResolvedValue(userRecords);
      expect(await repository.getRecordByUser(query, userUuid)).toBe(
        userRecords,
      );
    });

    it('should throw internalServerException if findMany fails with database error', async () => {
      mockPrisma.record.findMany.mockRejectedValue(
        new PrismaClientKnownRequestError('database error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.getRecordByUser(query, userUuid)).rejects.toThrow(
        new InternalServerErrorException('database error'),
      );
    });

    it('should throw internalServerException if findMany fails with unexpected error', async () => {
      mockPrisma.record.findMany.mockRejectedValue(
        new Error('unexpected error'),
      );
      await expect(repository.getRecordByUser(query, userUuid)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });

  describe('getRecordByProfessor', () => {
    it('should be defined', () => {
      expect(repository.getRecordByProfessor).toBeDefined();
    });

    const recordQuery: GetAllRecordQueryDto = {
      professorId: 1,
      take: 10,
      offset: 0,
      type: 'professor',
    };

    const records: ExpandedRecordType[] = [
      {
        id: 2,
        difficulty: 1,
        skill: 1,
        helpfulness: 1,
        interest: 1,
        load: 1,
        generosity: 1,
        review: 'review',
        recommendation: 'YES',
        semester: 'SPRING',
        year: 2021,
        createdAt: new Date(),
        sectionId: 26,
        userUuid: 'uuid',
        lectureId: 253,
        LectureSection: {
          id: 26,
          lectureId: 253,
          year: 2021,
          semester: 'SPRING',
          capacity: 0,
          registrationCount: null,
          fullCapacityTime: null,
          Lecture: {
            id: 253,
            name: 'name',
          },
          LectureSectionProfessor: [
            {
              sectionId: 26,
              lectureId: 253,
              year: 2021,
              semester: 'SPRING',
              professorId: 9,
              Professor: { id: 9, name: 'name' },
            },
          ],
        },
        _count: {
          RecordLike: 1,
        },
      },
    ];

    it('should find record by professor if exists', async () => {
      mockPrisma.record.findMany.mockResolvedValue(records);
      expect(await repository.getRecordByProfessor(recordQuery)).toBe(records);
    });

    it('should throw internalServerException if findMany fails with database error', async () => {
      mockPrisma.record.findMany.mockRejectedValue(
        new PrismaClientKnownRequestError('database error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(
        repository.getRecordByProfessor(recordQuery),
      ).rejects.toThrow(new InternalServerErrorException('database error'));
    });

    it('should throw internalServerException if findMany fails with unexpected error', async () => {
      mockPrisma.record.findMany.mockRejectedValue(
        new Error('unexpected error'),
      );
      await expect(
        repository.getRecordByProfessor(recordQuery),
      ).rejects.toThrow(new InternalServerErrorException('unexpected error'));
    });
  });

  describe('getRecordByLectureSection', () => {
    it('should be defined', () => {
      expect(repository.getRecordByLectureSection).toBeDefined();
    });

    const recordQuery: Omit<GetAllRecordQueryDto, 'type'> = {
      lectureId: 1,
      sectionId: 1,
      take: 10,
      offset: 0,
    };

    const records: ExpandedRecordType[] = [
      {
        id: 2,
        difficulty: 1,
        skill: 1,
        helpfulness: 1,
        interest: 1,
        load: 1,
        generosity: 1,
        review: 'review',
        recommendation: 'YES',
        semester: 'SPRING',
        year: 2021,
        createdAt: new Date(),
        sectionId: 26,
        userUuid: 'uuid',
        lectureId: 253,
        LectureSection: {
          id: 26,
          lectureId: 253,
          year: 2021,
          semester: 'SPRING',
          capacity: 0,
          registrationCount: null,
          fullCapacityTime: null,
          Lecture: {
            id: 253,
            name: 'name',
          },
          LectureSectionProfessor: [
            {
              sectionId: 26,
              lectureId: 253,
              year: 2021,
              semester: 'SPRING',
              professorId: 9,
              Professor: { id: 9, name: 'name' },
            },
          ],
        },
        _count: {
          RecordLike: 1,
        },
      },
    ];

    it('should find record by lecture and section if exists', async () => {
      mockPrisma.record.findMany.mockResolvedValue(records);
      expect(await repository.getRecordByLectureSection(recordQuery)).toBe(
        records,
      );
    });

    it('should throw internalServerException if findMany fails with database error', async () => {
      mockPrisma.record.findMany.mockRejectedValue(
        new PrismaClientKnownRequestError('database error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(
        repository.getRecordByLectureSection(recordQuery),
      ).rejects.toThrow(new InternalServerErrorException('database error'));
    });

    it('should throw internalServerException if findMany fails with unexpected error', async () => {
      mockPrisma.record.findMany.mockRejectedValue(
        new Error('unexpected error'),
      );
      await expect(
        repository.getRecordByLectureSection(recordQuery),
      ).rejects.toThrow(new InternalServerErrorException('unexpected error'));
    });
  });

  describe('createRecord', () => {
    it('should be defined', () => {
      expect(repository.createRecord).toBeDefined();
    });

    const body: CreateRecordBodyDto = {
      difficulty: 3,
      skill: 3,
      helpfulness: 3,
      interest: 3,
      load: 3,
      generosity: 3,
      review: 'reviewreviewreviewreview',
      recommendation: 'YES',
      semester: 'SPRING',
      year: 2024,
      lectureId: 253,
      sectionId: 26,
    };

    const userUuid: string = 'uuid';

    const result: RecordResDto = {
      id: 2,
      difficulty: 3,
      skill: 3,
      helpfulness: 3,
      interest: 3,
      load: 3,
      generosity: 3,
      review: 'reviewreviewreviewreview',
      recommendation: 'YES',
      semester: 'SPRING',
      year: 2024,
      createdAt: new Date(),
      sectionId: 26,
      userUuid: 'uuid',
      lectureId: 253,
    };

    it('should create record', async () => {
      mockPrisma.record.create.mockResolvedValue(result);
      expect(await repository.createRecord(body, userUuid)).toBe(result);
    });

    it('should throw internalServerException if create fails with database error', async () => {
      mockPrisma.record.create.mockRejectedValue(
        new PrismaClientKnownRequestError('database error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.createRecord(body, userUuid)).rejects.toThrow(
        new InternalServerErrorException('database error'),
      );
    });

    it('should throw internalServerException if create fails with unexpected error', async () => {
      mockPrisma.record.create.mockRejectedValue(new Error('unexpected error'));
      await expect(repository.createRecord(body, userUuid)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });

  describe('updateRecord', () => {
    it('should be defined', () => {
      expect(repository.updateRecord).toBeDefined();
    });

    const id: number = 1;

    const body: UpdateRecordBodyDto = {
      difficulty: 1,
      skill: 1,
      helpfulness: 1,
      interest: 1,
      load: 1,
      generosity: 1,
    };

    const userUuid: string = 'uuid';

    const result: RecordResDto = {
      id: 2,
      difficulty: 3,
      skill: 3,
      helpfulness: 3,
      interest: 3,
      load: 3,
      generosity: 3,
      review: 'reviewreviewreviewreview',
      recommendation: 'YES',
      semester: 'SPRING',
      year: 2024,
      createdAt: new Date(),
      sectionId: 26,
      userUuid: 'uuid',
      lectureId: 253,
    };

    it('should update record', async () => {
      mockPrisma.record.update.mockResolvedValue(result);
      expect(await repository.updateRecord(body, id, userUuid)).toBe(result);
    });

    it('should throw internalServerException if update fails with database error', async () => {
      mockPrisma.record.update.mockRejectedValue(
        new PrismaClientKnownRequestError('database error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(repository.updateRecord(body, id, userUuid)).rejects.toThrow(
        new InternalServerErrorException('database error'),
      );
    });

    it('should throw internalServerException if update fails with unexpected error', async () => {
      mockPrisma.record.update.mockRejectedValue(new Error('unexpected error'));
      await expect(repository.updateRecord(body, id, userUuid)).rejects.toThrow(
        new InternalServerErrorException('unexpected error'),
      );
    });
  });

  describe('createRecordLike', () => {
    it('should be defined', () => {
      expect(repository.createRecordLike).toBeDefined();
    });

    const recordId: number = 1;

    const userUuid: string = 'uuid';

    const result: RecordLike = {
      id: 1,
      recordId: 1,
      userUuid: 'uuid',
      createdAt: new Date(),
      deletedAt: null,
    };

    it('should create recordLike', async () => {
      mockPrisma.recordLike.create.mockResolvedValue(result);
      expect(await repository.createRecordLike(recordId, userUuid)).toBe(
        result,
      );
    });

    it('should throw internalServerException if create fails with database error', async () => {
      mockPrisma.recordLike.create.mockRejectedValue(
        new PrismaClientKnownRequestError('database error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(
        repository.createRecordLike(recordId, userUuid),
      ).rejects.toThrow(new InternalServerErrorException('database error'));
    });

    it('should throw internalServerException if create fails with unexpected error', async () => {
      mockPrisma.recordLike.create.mockRejectedValue(
        new Error('unexpected error'),
      );
      await expect(
        repository.createRecordLike(recordId, userUuid),
      ).rejects.toThrow(new InternalServerErrorException('unexpected error'));
    });
  });

  describe('findUserRecordLike', () => {
    it('should be defined', () => {
      expect(repository.findUserRecordLike).toBeDefined();
    });

    const recordId: number = 1;

    const userUuid: string = 'uuid';

    const result: RecordLike = {
      id: 1,
      recordId: 1,
      userUuid: 'uuid',
      createdAt: new Date(),
      deletedAt: null,
    };

    it('should find user recordLike when it exists', async () => {
      mockPrisma.recordLike.findFirst.mockResolvedValue(result);
      expect(await repository.findUserRecordLike(recordId, userUuid)).toBe(
        result,
      );
    });

    it('should return null if user recordLike does not exist', async () => {
      mockPrisma.recordLike.findFirst.mockResolvedValue(null);
      expect(
        await repository.findUserRecordLike(recordId, userUuid),
      ).toBeNull();
    });

    it('should throw internalServerException if findFirst fails with database error', async () => {
      mockPrisma.recordLike.findFirst.mockRejectedValue(
        new PrismaClientKnownRequestError('database error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(
        repository.findUserRecordLike(recordId, userUuid),
      ).rejects.toThrow(new InternalServerErrorException('database error'));
    });

    it('should throw internalServerException if findFirst fails with unexpected error', async () => {
      mockPrisma.recordLike.findFirst.mockRejectedValue(
        new Error('unexpected error'),
      );
      await expect(
        repository.findUserRecordLike(recordId, userUuid),
      ).rejects.toThrow(new InternalServerErrorException('unexpected error'));
    });
  });

  describe('deleteRecordLike', () => {
    it('should be defined', () => {
      expect(repository.deleteRecordLike).toBeDefined();
    });

    const recordId: number = 1;

    const userUuid: string = 'uuid';

    it('should update deletedAt column', async () => {
      mockPrisma.recordLike.updateMany.mockResolvedValue({ count: 1 });
      expect(
        await repository.deleteRecordLike(recordId, userUuid),
      ).toBeUndefined();
    });

    it('should throw internalServerException if update fails with database error', async () => {
      mockPrisma.recordLike.updateMany.mockRejectedValue(
        new PrismaClientKnownRequestError('database error', {
          code: 'P2002',
          clientVersion: '2.20.0',
        }),
      );
      await expect(
        repository.deleteRecordLike(recordId, userUuid),
      ).rejects.toThrow(new InternalServerErrorException('database error'));
    });

    it('should throw internalServerException if update fails with unexpected error', async () => {
      mockPrisma.recordLike.updateMany.mockRejectedValue(
        new Error('unexpected error'),
      );
      await expect(
        repository.deleteRecordLike(recordId, userUuid),
      ).rejects.toThrow(new InternalServerErrorException('unexpected error'));
    });
  });
});
