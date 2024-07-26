import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { RecordController } from '../../src/record/record.controller';
import { RecordService } from '../../src/record/record.service';
import { GetAllRecordQueryDto } from '../../src/record/dto/req/getAllRecordQuery.dto';
import { RecordLike, User } from '@prisma/client';
import { CreateRecordBodyDto } from '../../src/record/dto/req/createRecordBody.dto';
import { RecordResDto } from '../../src/record/dto/res/recordRes.dto';
import { UpdateRecordBodyDto } from '../../src/record/dto/req/updateRecordBody.dto';
import { ExpandedRecordType } from '../../src/record/types/ExpandedRecord.type';

describe('RecordController', () => {
  let controller: RecordController;
  let mockRecordService: DeepMockProxy<RecordService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordController],
      providers: [
        {
          provide: RecordService,
          useValue: mockDeep<RecordService>(),
        },
      ],
    }).compile();

    controller = module.get<RecordController>(RecordController);
    mockRecordService = module.get(RecordService);
  });

  describe('getRecordList', () => {
    it('should be defined', () => {
      expect(controller.getRecordList).toBeDefined();
    });

    it('should return correct record list with query parameter', async () => {
      const query: GetAllRecordQueryDto = { type: 'evaluation' };
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };

      const result: ExpandedRecordType[] = [
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
          _count: {
            RecordLike: 1,
          },
        },
      ];

      mockRecordService.getRecordList.mockResolvedValue(result);

      expect(await controller.getRecordList(query, user)).toEqual(result);
      expect(mockRecordService.getRecordList).toHaveBeenCalledWith(query, user);
    });

    it('should throw error when recordService.getRecordList throw error', async () => {
      mockRecordService.getRecordList.mockRejectedValue(new Error());
      await expect(
        controller.getRecordList(
          { type: 'evaluation' },
          {
            uuid: 'uuid',
            name: 'name',
            consent: false,
            createdAt: new Date(),
          },
        ),
      ).rejects.toThrow();
    });
  });

  describe('createRecord', () => {
    it('should be defined', () => {
      expect(controller.createRecord).toBeDefined();
    });

    it('should create record with correct parameters', async () => {
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

      mockRecordService.createRecord.mockResolvedValue(result);

      expect(await controller.createRecord(body, user)).toEqual(result);
      expect(mockRecordService.createRecord).toHaveBeenCalledWith(body, user);
    });

    it('should throw error when recordService.createRecord throw error', async () => {
      mockRecordService.createRecord.mockRejectedValue(new Error());
      await expect(
        controller.createRecord(
          {
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
          },
          {
            uuid: 'uuid',
            name: 'name',
            consent: false,
            createdAt: new Date(),
          },
        ),
      ).rejects.toThrow();
    });
  });

  describe('updateRecord', () => {
    it('should be defined', () => {
      expect(controller.updateRecord).toBeDefined();
    });

    it('should update record with correct parameters', async () => {
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

      mockRecordService.updateRecord.mockResolvedValue(result);

      expect(await controller.updateRecord(id, body, user)).toEqual(result);
      expect(mockRecordService.updateRecord).toHaveBeenCalledWith(
        body,
        id,
        user,
      );
    });

    it('should throw error when recordService.updateRecord throw error', async () => {
      mockRecordService.updateRecord.mockRejectedValue(new Error());
      await expect(
        controller.updateRecord(
          1,
          {
            difficulty: 1,
            skill: 1,
            helpfulness: 1,
            interest: 1,
            load: 1,
            generosity: 1,
          },
          {
            uuid: 'uuid',
            name: 'name',
            consent: false,
            createdAt: new Date(),
          },
        ),
      ).rejects.toThrow();
    });
  });

  describe('createRecordLike', () => {
    it('should be defined', () => {
      expect(controller.createRecordLike).toBeDefined();
    });

    it('should create record like', async () => {
      const recordId: number = 1;
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };

      const result: RecordLike = {
        id: 1,
        createdAt: new Date(),
        deletedAt: null,
        userUuid: 'uuid',
        recordId: 1,
      };

      mockRecordService.createRecordLike.mockResolvedValue(result);

      expect(await controller.createRecordLike(recordId, user)).toEqual(result);
      expect(mockRecordService.createRecordLike).toHaveBeenCalledWith(
        recordId,
        user,
      );
    });

    it('should throw error when recordService.createRecordLike throw error', async () => {
      mockRecordService.createRecordLike.mockRejectedValue(new Error());
      await expect(
        controller.createRecordLike(1, {
          uuid: 'uuid',
          name: 'name',
          consent: false,
          createdAt: new Date(),
        }),
      ).rejects.toThrow();
    });
  });

  describe('removeRecordLike', () => {
    it('should be defined', () => {
      expect(controller.removeRecordLike).toBeDefined();
    });

    it('should delete record like', async () => {
      const recordId: number = 1;
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };

      mockRecordService.removeRecordLike.mockResolvedValue();

      expect(await controller.removeRecordLike(recordId, user)).toBeUndefined();
    });

    it('should throw error when recordService.removeRecordLike throw error', async () => {
      mockRecordService.removeRecordLike.mockRejectedValue(new Error());
      await expect(
        controller.removeRecordLike(1, {
          uuid: 'uuid',
          name: 'name',
          consent: false,
          createdAt: new Date(),
        }),
      ).rejects.toThrow();
    });
  });
});
