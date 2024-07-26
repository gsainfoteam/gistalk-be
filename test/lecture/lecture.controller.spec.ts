import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { EvaluationResDto } from 'src/lecture/dto/res/evaluationRes.dto';
import { ExpandedLectureResDto } from 'src/lecture/dto/res/lectureRes.dto';
import { LectureController } from 'src/lecture/lecture.controller';
import { LectureService } from 'src/lecture/lecture.service';

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
                lectureId: value,
                sectionId: 1,
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
      mockLectureService.getOne.mockResolvedValue(expectedResult);
      const result: ExpandedLectureResDto = await mockLectureService.getOne(1);

      expect(result.id).toBe(value);
      expect(result.LectureCode[0].lectureId).toBe(value);
      expect(result.LectureSection[0].lectureId).toBe(value);
      expect(
        result.LectureSection[0].LectureSectionProfessor[0].lectureId,
      ).toBe(value);
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
      mockLectureService.getEvaluation.mockImplementationOnce(({ lectureId }) =>
        Promise.resolve(result1),
      );

      mockLectureService.getEvaluation.mockImplementationOnce(
        ({ lectureId, sectionId }) => Promise.resolve(result2),
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
            LectureSection: [
              {
                id: 1,
                lectureId: 1,
                LectureSectionProfessor: [],
              },
            ],
          },
        ]),
      );

      const result = await lectureController.search({ keyword: 'name' });

      expect(/name/.test(result[0].name)).toBe(true);
      expect(/name/.test(result[0].LectureCode[0].code)).toBe(true);
    });
  });
});
