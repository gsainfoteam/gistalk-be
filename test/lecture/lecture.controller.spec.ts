import { Test } from '@nestjs/testing';
import { LectureController } from 'src/lecture/lecture.controller';
import { LectureService } from 'src/lecture/lecture.service';

describe('LectureController', () => {
  let lectureController: LectureController;

  const mockLectureService = {
    getAll: jest.fn().mockImplementation(() => Promise.resolve([])),
    getOne: jest.fn().mockImplementation((value) =>
      Promise.resolve({
        id: value,
        name: 'name',
        LectureCode: [
          {
            code: 'code',
            lecutureId: value,
          },
        ],
        LectureSection: [
          {
            id: 1,
            lectureId: value,
            Professor: [
              {
                id: 1,
                name: 'name',
              },
            ],
          },
        ],
      }),
    ),
    getEvaluation: jest.fn().mockImplementation(() =>
      Promise.resolve({
        difficulty: 1,
        skill: 1,
        helpfulness: 1,
        interest: 1,
        load: 1,
        generosity: 1,
      }),
    ),
    search: jest.fn().mockImplementation(({ keyword }) =>
      Promise.resolve([
        {
          id: 1,
          name: new RegExp(`.${keyword}.`),
          LectureCode: [
            {
              code: new RegExp(`.${keyword}.`),
              lectureId: 1,
            },
          ],
          LectureSection: [
            {
              id: 1,
              lectureId: 1,
              Professor: [
                {
                  id: 1,
                  name: 'name',
                },
              ],
            },
          ],
        },
      ]),
    ),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LectureController],
      providers: [LectureService],
    })
      .overrideProvider(LectureService)
      .useValue(mockLectureService)
      .compile();

    lectureController = moduleRef.get<LectureController>(LectureController);
  });
  it('to be defined', async () => {
    expect(lectureController).toBeDefined();
    expect(LectureService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list', async () => {
      expect(await lectureController.getAll({})).toEqual([]);
    });
  });

  describe('getOne', () => {
    it('should return ExpandedLecutreDto', async () => {
      expect(await lectureController.getOne(1)).toEqual({
        id: 1,
        name: 'name',
        LectureCode: [
          {
            code: 'code',
            lecutureId: 1,
          },
        ],
        LectureSection: [
          {
            id: 1,
            lectureId: 1,
            Professor: [
              {
                id: 1,
                name: 'name',
              },
            ],
          },
        ],
      });
    });
  });

  describe('getEvaluation', () => {
    it('should return EvaluationResDto', async () => {
      expect(await lectureController.getEvaluation({ lectureId: 1 })).toEqual({
        difficulty: 1,
        skill: 1,
        helpfulness: 1,
        interest: 1,
        load: 1,
        generosity: 1,
      });

      expect(
        await lectureController.getEvaluation({ lectureId: 1, sectionId: 1 }),
      ).toEqual({
        difficulty: 1,
        skill: 1,
        helpfulness: 1,
        interest: 1,
        load: 1,
        generosity: 1,
      });
    });
  });

  describe('search', () => {
    it('should return a lecture having keyword in name or lecture code', async () => {
      const result = await lectureController.search({ keyword: 'name' });

      console.log(result[0].name);
      expect(/name/.test(result[0].name)).toBe(true);
      expect(/name/.test(result[0].LectureCode[0].code)).toBe(true);
    });
  });
});
