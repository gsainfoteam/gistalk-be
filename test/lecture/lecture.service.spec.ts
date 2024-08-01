import { Test } from '@nestjs/testing';
import { BookMark, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { BookMarkQueryDto } from 'src/lecture/dto/req/bookmarkReq.dto';
import { EvaluationResDto } from 'src/lecture/dto/res/evaluationRes.dto';
import { ExpandedLectureResDto } from 'src/lecture/dto/res/lectureRes.dto';
import { LectureRepository } from 'src/lecture/lecture.repository';
import { LectureService } from 'src/lecture/lecture.service';

describe('LectureService', () => {
  let lectureService: LectureService;
  let mockLectureRepository: DeepMockProxy<LectureRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LectureService,
        {
          provide: LectureRepository,
          useValue: mockDeep<LectureRepository>(),
        },
      ],
    }).compile();

    lectureService = moduleRef.get<LectureService>(LectureService);
    mockLectureRepository = moduleRef.get(LectureRepository);
  });

  it('to be defined', async () => {
    expect(lectureService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', async () => {
      mockLectureRepository.getAll.mockResolvedValue(Promise.resolve([]));
      expect(await lectureService.getAll({})).toBeInstanceOf(Array);
    });

    it('should throw error when mockLectureRepository.getAll throw ', async () => {
      mockLectureRepository.getAll.mockRejectedValue(new Error());

      expect(
        lectureService.getAll({ professorName: 'something' }),
      ).rejects.toThrow(Error);
    });
  });

  describe('getOne', () => {
    it('should return one lecture whose id, LectureCode.lectureId, LectureSection.lectureId, LectureSectionProfessor.lectureId are the same with the given id', async () => {
      const value = 1;
      const expectedResult: ExpandedLectureResDto = {
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
            LectureSectionProfessor: [
              {
                sectionId: 1,
                lectureId: value,
                professorId: 1,
                Professor: {
                  id: 1,
                  name: 'name',
                },
              },
            ],
          },
        ],
      };
      mockLectureRepository.getOne.mockResolvedValue(expectedResult);

      const result: ExpandedLectureResDto = await lectureService.getOne(1);
      expect(result.id).toBe(value);
      expect(result.LectureCode[0].lectureId).toBe(value);
      expect(result.LectureSection[0].lectureId).toBe(value);
      expect(
        result.LectureSection[0].LectureSectionProfessor[0].lectureId,
      ).toBe(value);
    });

    it('should throw error when mockLectureRepository.getOne throws error', async () => {
      await mockLectureRepository.getOne.mockRejectedValueOnce(new Error());

      expect(lectureService.getOne(1)).rejects.toThrow(Error);
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
    it('return evaluation', async () => {
      mockLectureRepository.getEvaluation.mockImplementationOnce(
        ({ lectureId }) => Promise.resolve(result1),
      );

      mockLectureRepository.getEvaluation.mockImplementationOnce(
        ({ lectureId, sectionId }) => Promise.resolve(result2),
      );

      expect(await lectureService.getEvaluation({ lectureId: 1 })).toEqual(
        result1,
      );

      expect(
        await lectureService.getEvaluation({ lectureId: 1, sectionId: 1 }),
      ).toEqual(result2);
    });
  });

  describe('search', () => {
    it('should return a list of lecture whose name or LectureCode.code contains the given keyword', async () => {
      mockLectureRepository.search.mockImplementation(({ keyword }) =>
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

      const result = await lectureService.search({ keyword: 'name' });
      expect(result).toBeInstanceOf(Array);
      expect(/name/.test(result[0].name)).toBe(true);
      expect(/name/.test(result[0].LectureCode[0].code)).toBe(true);
    });
  });

  describe('addBookMark', () => {
    const mockQuery: BookMarkQueryDto = {
      lectureId: 1,
      sectionId: 2,
    };

    const mockUser: User = {
      uuid: 'uuid',
      name: 'name',
      consent: true,
      createdAt: new Date(),
    };

    it('should create addBookMark', async () => {
      const expectedResult: BookMark = {
        lectureId: 1,
        sectionId: 2,
        userUuid: 'uuid',
      };

      mockLectureRepository.addBookMark.mockResolvedValue(expectedResult);

      const result = await lectureService.addBookMark(mockQuery, mockUser);

      expect(mockLectureRepository.addBookMark).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.lectureId).toBe(expectedResult.lectureId);
      expect(result.sectionId).toBe(expectedResult.sectionId);
      expect(result.userUuid).toBe(expectedResult.userUuid);
    });

    it('should throw Error when mockLectureRepository.addBookMark throws Error', async () => {
      mockLectureRepository.addBookMark.mockRejectedValue(new Error());

      await expect(
        lectureService.addBookMark(mockQuery, mockUser),
      ).rejects.toThrow(Error);
    });
  });

  describe('deleteBookMark', () => {
    const mockQuery: BookMarkQueryDto = {
      lectureId: 1,
      sectionId: 2,
    };

    const mockUser: User = {
      uuid: 'uuid',
      name: 'name',
      consent: true,
      createdAt: new Date(),
    };

    it('should create deleteBookMark', async () => {
      const expectedResult: BookMark = {
        lectureId: 1,
        sectionId: 2,
        userUuid: 'uuid',
      };

      mockLectureRepository.deleteBookMark.mockResolvedValue(expectedResult);

      const result = await lectureService.deleteBookMark(mockQuery, mockUser);

      expect(mockLectureRepository.deleteBookMark).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.lectureId).toBe(expectedResult.lectureId);
      expect(result.sectionId).toBe(expectedResult.sectionId);
      expect(result.userUuid).toBe(expectedResult.userUuid);
    });

    it('should throw Error when mockLectureRepository.deleteBookMark throws Error', async () => {
      mockLectureRepository.deleteBookMark.mockRejectedValue(new Error());

      await expect(
        lectureService.deleteBookMark(mockQuery, mockUser),
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
    it('should return all bookmarks with userUuid', async () => {
      const expectedResult: BookMark[] = [
        {
          lectureId: 1,
          sectionId: 2,
          userUuid: 'uuid',
        },
        {
          lectureId: 2,
          sectionId: 1,
          userUuid: 'uuid',
        },
      ];

      mockLectureRepository.getBookMark.mockResolvedValue(expectedResult);

      const result = await lectureService.getBookMark(mockUser);

      expect(result[0].lectureId).toBe(expectedResult[0].lectureId);
      expect(result[0].sectionId).toBe(expectedResult[0].sectionId);
      expect(result[0].userUuid).toBe(expectedResult[0].userUuid);
      expect(result[1].lectureId).toBe(expectedResult[1].lectureId);
      expect(result[1].sectionId).toBe(expectedResult[1].sectionId);
      expect(result[1].userUuid).toBe(expectedResult[1].userUuid);
    });

    it('should throw error when mockLectureRepository.getBookMark throws Error', async () => {
      mockLectureRepository.getBookMark.mockRejectedValue(new Error());

      expect(lectureService.getBookMark(mockUser)).rejects.toThrow(Error);
    });
  });
});
