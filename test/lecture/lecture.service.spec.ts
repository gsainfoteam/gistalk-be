import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
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
  });

  describe('getOne', () => {
    it('should return one lecture whose id, LectureCode.lectureId, LectureSection.lectureId are the same with the given id', async () => {
      mockLectureRepository.getOne.mockImplementation((id) =>
        Promise.resolve({
          id: id,
          name: 'name',
          LectureCode: [
            {
              code: 'code',
              lectureId: id,
            },
          ],
          LectureSection: [
            {
              id: 1,
              lectureId: id,
              Professor: [],
            },
          ],
        }),
      );

      const result: ExpandedLectureResDto = await lectureService.getOne(1);
      expect(result.id).toBe(1);
      expect(result.LectureCode[0].lectureId).toBe(1);
      expect(result.LectureSection[0].lectureId).toBe(1);
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
});
