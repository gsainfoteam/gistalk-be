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
    it('should return one lecture including lecture code and professor info', async () => {
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
              Professor: [
                {
                  id: 1,
                  name: 'name',
                },
              ],
            },
          ],
        }),
      );

      const result: ExpandedLectureResDto = await lectureService.getOne(1);
      expect(result.id).toBe(1);
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
    it('should return a list of lecture including lecture code and professor info', async () => {
      mockLectureRepository.search.mockImplementation(({ keyword }) =>
        Promise.resolve([]),
      );

      expect(await lectureService.search({ keyword: 'name' })).toBeInstanceOf(
        Array,
      );
    });
  });
});
