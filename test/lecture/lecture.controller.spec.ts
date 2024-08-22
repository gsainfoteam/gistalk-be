import { Test } from '@nestjs/testing';
import { BookMark, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { BookMarkQueryDto } from 'src/lecture/dto/req/bookmarkReq.dto';
import { EvaluationResDto } from 'src/lecture/dto/res/evaluationRes.dto';
import { ExpandedLectureResDto } from 'src/lecture/dto/res/lectureRes.dto';
import { LectureController } from 'src/lecture/lecture.controller';
import { LectureService } from 'src/lecture/lecture.service';
import { ExpandedLecture } from 'src/lecture/types/expandedLecture.type';

describe('LectureController', () => {
  let lectureController: LectureController;
  let mockLectureService: DeepMockProxy<LectureService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LectureController],
      providers: [
        {
          provide: LectureService,
          useValue: mockDeep<LectureService>(),
        },
      ],
    }).compile();

    lectureController = moduleRef.get<LectureController>(LectureController);
    mockLectureService = moduleRef.get(LectureService);
  });

  it('to be defined', async () => {
    expect(lectureController).toBeDefined();
    expect(LectureService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', async () => {
      mockLectureService.getAll.mockResolvedValue([]);
      expect(await lectureController.getAll({})).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return ExpandedLectureResDto whose id, LectureCode.lectureId, LectureSection.lectureId, LectureSectionProfessor.lectureId are the same with given id', async () => {
      const value = 1;
      const serviceResult: ExpandedLecture = {
        id: value,
        name: 'name',
        LectureCode: [
          {
            code: 'code',
            lectureId: value,
          },
        ],
        LectureSection: [
          {
            id: 1,
            lectureId: value,
            year: 2024,
            semester: 'FALL',
            capacity: 1,
            fullCapacityTime: 31,
            registrationCount: 1,
            LectureSectionProfessor: [
              {
                sectionId: 1,
                lectureId: value,
                year: 2024,
                semester: 'FALL',
                professorId: value,
                Professor: {
                  id: value,
                  name: 'name',
                },
              },
            ],
          },
        ],
      };
      mockLectureService.getOne.mockResolvedValue(serviceResult);
      const result: ExpandedLectureResDto = await lectureController.getOne(1);

      expect(result.id).toBe(value);
      expect(result.lectureSection[0].lectureId).toBe(value);
      expect(result.lectureSection[0].professor[0].id).toBe(value);
    });
  });

  describe('getEvaluation', () => {
    const result1: EvaluationResDto = {
      difficulty: 1,
      skill: 1,
      helpfulness: 1,
      interest: 1,
      load: 1,
      generosity: 1,
    };

    const result2: EvaluationResDto = {
      difficulty: 2,
      skill: 2,
      helpfulness: 2,
      interest: 2,
      load: 2,
      generosity: 2,
    };

    it('should return average Evaluation with lecture id or section id', async () => {
      mockLectureService.getEvaluation.mockImplementationOnce(({}) =>
        Promise.resolve(result1),
      );

      mockLectureService.getEvaluation.mockImplementationOnce(({}) =>
        Promise.resolve(result2),
      );

      expect(await lectureController.getEvaluation({ lectureId: 1 })).toEqual(
        result1,
      );

      expect(
        await lectureController.getEvaluation({ lectureId: 1, sectionId: 1 }),
      ).toEqual(result2);
    });
  });

  describe('search', () => {
    it('should return a lecture having keyword in name or lecture code', async () => {
      mockLectureService.search.mockImplementation(({ keyword }) =>
        Promise.resolve([
          {
            id: 1,
            name: `.${keyword}.`,
            LectureCode: [
              {
                code: `.${keyword}.`,
                lectureId: 1,
              },
            ],
            LectureSection: [],
          },
        ]),
      );

      const result = await lectureController.search({ keyword: 'name' });

      expect(/name/.test(result[0].name)).toBe(true);
      expect(/name/.test(result[0].LectureCode[0].code)).toBe(true);
    });
  });

  describe('addBookMark', () => {
    const mockQuery: BookMarkQueryDto = {
      lectureId: 1,
      sectionId: 2,
      year: 2024,
      semester: 'FALL',
    };

    const mockUser: User = {
      uuid: 'uuid',
      name: 'name',
      consent: true,
      createdAt: new Date(),
    };

    it('should create BookMark', async () => {
      const expectedResult: BookMark = {
        lectureId: 1,
        sectionId: 2,
        userUuid: 'uuid',
        year: 2024,
        semester: 'FALL',
      };

      mockLectureService.addBookMark.mockResolvedValue(expectedResult);

      const result = await lectureController.addBookMark(mockQuery, mockUser);

      expect(result).toBeDefined();
      expect(result.lectureId).toBe(expectedResult.lectureId);
      expect(result.sectionId).toBe(expectedResult.sectionId);
      expect(result.userUuid).toBe(expectedResult.userUuid);
    });

    it('should throw error when mockLectureService.addBookMark throws error', async () => {
      mockLectureService.addBookMark.mockRejectedValue(new Error());

      expect(
        lectureController.addBookMark(mockQuery, mockUser),
      ).rejects.toThrow(Error);
    });
  });

  describe('deleteBookMark', () => {
    const mockQuery: BookMarkQueryDto = {
      lectureId: 1,
      sectionId: 2,
      year: 2024,
      semester: 'FALL',
    };

    const mockUser: User = {
      uuid: 'uuid',
      name: 'name',
      consent: true,
      createdAt: new Date(),
    };

    it('should delete BookMark', async () => {
      const expectedResult: BookMark = {
        lectureId: 1,
        sectionId: 2,
        userUuid: 'uuid',
        year: 2024,
        semester: 'FALL',
      };

      mockLectureService.deleteBookMark.mockResolvedValue(expectedResult);

      const result = await lectureController.deleteBookMark(
        mockQuery,
        mockUser,
      );

      expect(result).toBeDefined();
      expect(result.lectureId).toBe(expectedResult.lectureId);
      expect(result.sectionId).toBe(expectedResult.sectionId);
      expect(result.userUuid).toBe(expectedResult.userUuid);
    });

    it('should throw error when mockLectureService.deleteBookMark throws error', async () => {
      mockLectureService.deleteBookMark.mockRejectedValue(new Error());

      expect(
        lectureController.deleteBookMark(mockQuery, mockUser),
      ).rejects.toThrow(Error);
    });
  });

  describe('getBookMark', () => {
    const mockUser: User = {
      uuid: 'uuid',
      name: 'name',
      consent: true,
      createdAt: new Date(),
    };

    it('should return all BookMark with userUuid', async () => {
      const expectedResult: BookMark[] = [
        {
          lectureId: 1,
          sectionId: 2,
          userUuid: 'uuid',
          year: 2024,
          semester: 'FALL',
        },
        {
          lectureId: 2,
          sectionId: 1,
          userUuid: 'uuid',
          year: 2024,
          semester: 'FALL',
        },
      ];

      mockLectureService.getBookMark.mockResolvedValue(expectedResult);

      const result = await lectureController.getBookMark(mockUser);

      expect(result).toBeDefined();
      expect(result[0].lectureId).toBe(expectedResult[0].lectureId);
      expect(result[0].sectionId).toBe(expectedResult[0].sectionId);
      expect(result[0].userUuid).toBe(expectedResult[0].userUuid);
      expect(result[1].lectureId).toBe(expectedResult[1].lectureId);
      expect(result[1].sectionId).toBe(expectedResult[1].sectionId);
      expect(result[1].userUuid).toBe(expectedResult[1].userUuid);
    });

    it('should throw error when mockLectureService.getBookMark throws error', async () => {
      mockLectureService.getBookMark.mockRejectedValue(new Error());

      expect(lectureController.getBookMark(mockUser)).rejects.toThrow(Error);
    });
  });
});
