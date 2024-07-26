import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { RecordLike, User } from '@prisma/client';
import { RecordService } from '../../src/record/record.service';
import { RecordRepository } from '../../src/record/record.repository';
import { GetAllRecordQueryDto } from '../../src/record/dto/req/getAllRecordQuery.dto';
import { ExpandedRecordType } from '../../src/record/types/ExpandedRecord.type';
import { CreateRecordBodyDto } from '../../src/record/dto/req/createRecordBody.dto';
import { RecordResDto } from '../../src/record/dto/res/recordRes.dto';
import { UpdateRecordBodyDto } from '../../src/record/dto/req/updateRecordBody.dto';

describe('RecordService', () => {
  let service: RecordService;
  let mockRecordRepository: DeepMockProxy<RecordRepository>;

  beforeEach(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      providers: [
        RecordService,
        {
          provide: RecordRepository,
          useValue: mockDeep<RecordRepository>(),
        },
      ],
    }).compile();

    service = mockModule.get<RecordService>(RecordService);
    mockRecordRepository = mockModule.get(RecordRepository);
  });

  describe('getRecordList', () => {
    it('should be defined', () => {
      expect(service.getRecordList).toBeDefined();
    });

    it('should call getRecentRecord when query is recent', async () => {
      const query: GetAllRecordQueryDto = { type: 'recent' };
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
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
            Lecture: {
              id: 253,
              name: 'name',
            },
            LectureSectionProfessor: [
              {
                sectionId: 26,
                lectureId: 253,
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

      mockRecordRepository.getRecentRecord.mockResolvedValue(recentRecords);

      expect(await service.getRecordList(query, user)).toEqual(recentRecords);
      expect(mockRecordRepository.getRecentRecord).toHaveBeenCalledWith(query);
    });

    it('should call getRecordByUser when query is user', async () => {
      const query: GetAllRecordQueryDto = { type: 'user' };
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
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
            Lecture: {
              id: 253,
              name: 'name',
            },
            LectureSectionProfessor: [
              {
                sectionId: 26,
                lectureId: 253,
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

      mockRecordRepository.getRecordByUser.mockResolvedValue(userRecords);

      expect(await service.getRecordList(query, user)).toEqual(userRecords);
      expect(mockRecordRepository.getRecordByUser).toHaveBeenCalledWith(
        query,
        user.uuid,
      );
    });

    it('should throw BadRequestException when user is not provided', async () => {
      await expect(service.getRecordList({ type: 'user' })).rejects.toThrow(
        new BadRequestException('need login'),
      );

      expect(mockRecordRepository.getRecentRecord).not.toHaveBeenCalled();
      expect(mockRecordRepository.getRecordByUser).not.toHaveBeenCalled();
      expect(
        mockRecordRepository.getRecordByLectureSection,
      ).not.toHaveBeenCalled();
    });

    it('should call getRecordByLectureSection when query is evaluation', async () => {
      const query: GetAllRecordQueryDto = {
        type: 'evaluation',
        lectureId: 253,
        sectionId: 26,
      };
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
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
            Lecture: {
              id: 253,
              name: 'name',
            },
            LectureSectionProfessor: [
              {
                sectionId: 26,
                lectureId: 253,
                professorId: 9,
                Professor: {
                  id: 9,
                  name: 'name',
                },
              },
            ],
          },
          _count: {
            RecordLike: 1,
          },
        },
      ];

      mockRecordRepository.getRecordByLectureSection.mockResolvedValue(records);

      expect(await service.getRecordList(query, user)).toEqual(records);
      expect(
        mockRecordRepository.getRecordByLectureSection,
      ).toHaveBeenCalledWith(query);
    });

    it('should throw BadRequestException when lectureId is not provided', async () => {
      const query: GetAllRecordQueryDto = {
        type: 'evaluation',
      };
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };

      await expect(service.getRecordList(query, user)).rejects.toThrow(
        new BadRequestException('need lectureId'),
      );
      expect(
        mockRecordRepository.getRecordByLectureSection,
      ).not.toHaveBeenCalled();
    });

    it('should call createRecord', async () => {
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
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };

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

      mockRecordRepository.createRecord.mockResolvedValue(result);

      expect(await service.createRecord(body, user)).toEqual(result);
      expect(mockRecordRepository.createRecord).toHaveBeenCalledWith(
        body,
        user.uuid,
      );
    });

    it('should call updateRecord', async () => {
      const id: number = 1;
      const body: UpdateRecordBodyDto = {
        difficulty: 1,
        skill: 1,
        helpfulness: 1,
        interest: 1,
        load: 1,
        generosity: 1,
      };
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };

      const result: RecordResDto = {
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
      };

      mockRecordRepository.updateRecord.mockResolvedValue(result);

      expect(await service.updateRecord(body, id, user)).toEqual(result);
      expect(mockRecordRepository.updateRecord).toHaveBeenCalledWith(
        body,
        id,
        user.uuid,
      );
    });

    it('should throw ConflictException when user already liked the record', async () => {
      const recordId = 1;
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };

      const recordLike: RecordLike = {
        id: 2,
        createdAt: new Date(),
        deletedAt: null,
        userUuid: 'uuid',
        recordId: 1,
      };

      mockRecordRepository.findUserRecordLike.mockResolvedValue(recordLike); // 이미 좋아요 한 경우

      await expect(service.createRecordLike(recordId, user)).rejects.toThrow(
        new ConflictException('user already liked record'),
      );

      expect(mockRecordRepository.findUserRecordLike).toHaveBeenCalledWith(
        recordId,
        user.uuid,
      );
      expect(mockRecordRepository.createRecordLike).not.toHaveBeenCalled();
    });

    it('should create record like when user has not liked the record', async () => {
      const recordId = 1;
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      const recordLike: RecordLike = {
        id: 1,
        recordId: 1,
        userUuid: 'uuid',
        createdAt: new Date(),
        deletedAt: null,
      };

      mockRecordRepository.findUserRecordLike.mockResolvedValue(null);
      mockRecordRepository.createRecordLike.mockResolvedValue(recordLike);

      expect(await service.createRecordLike(recordId, user)).toEqual(
        recordLike,
      );
      expect(mockRecordRepository.findUserRecordLike).toHaveBeenCalledWith(
        recordId,
        user.uuid,
      );
      expect(mockRecordRepository.createRecordLike).toHaveBeenCalledWith(
        recordId,
        user.uuid,
      );
    });

    it('should call removeRecordLike', async () => {
      const recordId: number = 1;
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };

      mockRecordRepository.deleteRecordLike.mockResolvedValue();

      expect(await service.removeRecordLike(recordId, user)).toBeUndefined();
      expect(mockRecordRepository.deleteRecordLike).toHaveBeenCalledWith(
        recordId,
        user.uuid,
      );
    });
  });
});
