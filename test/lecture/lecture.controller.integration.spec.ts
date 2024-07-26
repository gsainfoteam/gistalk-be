import {
  INestApplication,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ExpandedLectureResDto } from 'src/lecture/dto/res/lectureRes.dto';
import { LectureController } from 'src/lecture/lecture.controller';
import { LectureRepository } from 'src/lecture/lecture.repository';
import { LectureService } from 'src/lecture/lecture.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import * as request from 'supertest';

describe('LectureController (integration)', () => {
  let app: INestApplication;
  let mockLectureService: DeepMockProxy<LectureService>;
  let mockLectureRepository: DeepMockProxy<LectureRepository>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [LectureController],
      providers: [
        {
          provide: LectureService,
          useValue: mockDeep<LectureService>(),
        },
        {
          provide: LectureRepository,
          useValue: mockDeep<LectureRepository>(),
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    mockLectureService = moduleRef.get(LectureService);
    mockLectureRepository = moduleRef.get(LectureRepository);

    await app.init();
  });

  it('should be defined', () => {
    expect(mockLectureService).toBeDefined();
    expect(mockLectureRepository).toBeDefined();
  });

  describe('getAll', () => {
    it('should return array of lectures if professorName is not provided', async () => {
      mockLectureService.getAll.mockResolvedValue([]);
      const result = await request(app.getHttpServer())
        .get('/lecture')
        .query({})
        .send();

      expect(result.status).toBe(200);
      expect(result.body).toBeInstanceOf(Array);
    });

    it('should return all lectures with professorName', async () => {
      const expectResult: ExpandedLectureResDto[] = [
        {
          id: 1,
          name: 'name',
          LectureCode: [
            {
              code: 'code',
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
                  name: 'test',
                },
              ],
            },
          ],
        },
      ];

      mockLectureService.getAll.mockResolvedValue(expectResult);

      const result = await request(app.getHttpServer())
        .get('/lecture')
        .query({
          professorName: 'test',
        })
        .send();

      expect(result.status).toBe(200);
      expect(result.body).toEqual(expectResult);
    });

    it('should 400 error when invalid type given as professorName', async () => {
      const result = await request(app.getHttpServer())
        .get('/lecture')
        .query({
          professorName: {
            invalid: 'invalid',
          },
        })
        .send();

      expect(result.status).toBe(400);
    });

    it('should 500 error when unexpected database error occurred', async () => {
      mockLectureService.getAll.mockRejectedValue(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .get('/lecture')
        .query({})
        .send();

      expect(result.status).toBe(500);
    });

    it('should 500 error when unexpected error occurred', async () => {
      mockLectureService.getAll.mockRejectedValue(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .get('/lecture')
        .query({})
        .send();

      expect(result.status).toBe(500);
    });
  });

  describe('search', () => {
    it('should return array of lectures with lecture name containing keyword ', async () => {
      mockLectureService.search.mockImplementation(({ keyword }) =>
        Promise.resolve([
          {
            id: 1,
            name: `contains ${keyword}`,
            LectureCode: [
              {
                code: 'code',
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
      );

      const result = await request(app.getHttpServer())
        .get('/lecture/search')
        .query({
          keyword: 'keyword',
        })
        .send();

      expect(result.status).toBe(200);
      expect(result.body[0].name).toContain('keyword');
    });

    it('should return array of lectures with lecture code containing keyword ', async () => {
      mockLectureService.search.mockImplementation(({ keyword }) =>
        Promise.resolve([
          {
            id: 1,
            name: 'name',
            LectureCode: [
              {
                code: `Contains ${keyword}`,
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
      );

      const result = await request(app.getHttpServer())
        .get('/lecture/search')
        .query({
          keyword: 'keyword',
        })
        .send();

      expect(result.status).toBe(200);
      expect(result.body[0].LectureCode[0].code).toContain('keyword');
    });

    it('should 400 error when invalid type given as keyword', async () => {
      const result = await request(app.getHttpServer())
        .get('/lecture/search')
        .query({
          keyword: {
            invalid: 'invalid',
          },
        })
        .send();

      expect(result.status).toBe(400);
    });

    it('should 500 error when unexpected database error occurred', async () => {
      mockLectureService.search.mockRejectedValue(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .get('/lecture/search')
        .query({ keyword: 'keyword' })
        .send();

      expect(result.status).toBe(500);
    });

    it('should 500 error when unexpected error occurred', async () => {
      mockLectureService.search.mockRejectedValue(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .get('/lecture/search')
        .query({ keyword: 'keyword' })
        .send();

      expect(result.status).toBe(500);
    });
  });

  describe('getEvaluation', () => {
    it('should return average evaluation of lectureId', async () => {
      const expectResult = {
        difficulty: 1,
        skill: 1,
        helpfulness: 1,
        interest: 1,
        load: 1,
        generosity: 1,
      };

      mockLectureService.getEvaluation.mockResolvedValue(expectResult);

      const result = await request(app.getHttpServer())
        .get('/lecture/evaluation')
        .query({
          lectureId: 1,
        })
        .send();

      expect(result.status).toBe(200);
      expect(result.body).toEqual(expectResult);
    });

    it('should return average evaluation of sectionId', async () => {
      const expectResult = {
        difficulty: 1,
        skill: 1,
        helpfulness: 1,
        interest: 1,
        load: 1,
        generosity: 1,
      };

      mockLectureService.getEvaluation.mockResolvedValue(expectResult);

      const result = await request(app.getHttpServer())
        .get('/lecture/evaluation')
        .query({
          lectureId: 1,
          sectionId: 1,
        })
        .send();

      expect(result.status).toBe(200);
      expect(result.body).toEqual(expectResult);
    });

    it('should 400 error when invalid type given as lectureId', async () => {
      const result = await request(app.getHttpServer())
        .get('/lecture/evaluation')
        .query({
          lectureId: 'invalid',
        })
        .send();

      expect(result.status).toBe(400);
    });

    it('should 400 error when invalid type given as sectionId', async () => {
      const result = await request(app.getHttpServer())
        .get('/lecture/evaluation')
        .query({
          lectureId: 1,
          sectionId: 'invalid',
        })
        .send();

      expect(result.status).toBe(400);
    });

    it('should 500 error when unexpected database error occurred', async () => {
      mockLectureService.getEvaluation.mockRejectedValue(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .get('/lecture/evaluation')
        .query({
          lectureId: 1,
        })
        .send();

      expect(result.status).toBe(500);
    });

    it('should 500 error when unexpected error occurred', async () => {
      mockLectureService.getEvaluation.mockRejectedValue(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .get('/lecture/evaluation')
        .query({
          lectureId: 1,
        })
        .send();

      expect(result.status).toBe(500);
    });
  });

  describe('getOne', () => {
    it('should return lecture with id', async () => {
      const expectResult: ExpandedLectureResDto = {
        id: 1,
        name: 'name',
        LectureCode: [
          {
            code: 'code',
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
      };

      mockLectureService.getOne.mockResolvedValue(expectResult);

      const result = await request(app.getHttpServer())
        .get('/lecture/1')
        .send();

      expect(result.status).toBe(200);
      expect(result.body).toEqual(expectResult);
    });

    it('should 400 error when invalid type given as id', async () => {
      const result = await request(app.getHttpServer())
        .get('/lecture/invalid')
        .send();

      expect(result.status).toBe(400);
    });

    it('should return 404 error when invalid id', async () => {
      mockLectureService.getOne.mockRejectedValue(
        new NotFoundException('Invalid ID'),
      );

      const result = await request(app.getHttpServer())
        .get('/lecture/9999')
        .send();

      expect(result.status).toBe(404);
    });

    it('should 500 error when unexpected database error occurred', async () => {
      mockLectureService.getOne.mockRejectedValue(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .get('/lecture/1')
        .send();

      expect(result.status).toBe(500);
    });

    it('should 500 error when unexpected error occurred', async () => {
      mockLectureService.getOne.mockRejectedValue(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .get('/lecture/1')
        .send();

      expect(result.status).toBe(500);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
