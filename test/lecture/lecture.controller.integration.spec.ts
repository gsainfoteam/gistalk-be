import {
  BadRequestException,
  INestApplication,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BookMark, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { IdpService } from 'src/idp/idp.service';
import { UserInfo } from 'src/idp/types/userInfo.type';
import { BookMarkQueryDto } from 'src/lecture/dto/req/bookmarkReq.dto';
import { LectureController } from 'src/lecture/lecture.controller';
import { LectureRepository } from 'src/lecture/lecture.repository';
import { LectureService } from 'src/lecture/lecture.service';
import { ExpandedLecture } from 'src/lecture/types/expandedLecture.type';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IdPGuard, IdPOptionalGuard } from 'src/user/guard/idp.guard';
import { IdPStrategy } from 'src/user/guard/idp.strategy';
import { IdPOptionalStrategy } from 'src/user/guard/idpOptional.strategy';
import { UserService } from 'src/user/user.service';
import * as request from 'supertest';

describe('LectureController (integration)', () => {
  let app: INestApplication;
  let mockLectureService: DeepMockProxy<LectureService>;
  let mockLectureRepository: DeepMockProxy<LectureRepository>;
  let mockIdPService: DeepMockProxy<IdpService>;
  let mockUserService: DeepMockProxy<UserService>;

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
        {
          provide: IdpService,
          useValue: mockDeep<IdpService>(),
        },
        {
          provide: UserService,
          useValue: mockDeep<UserService>(),
        },
        IdPGuard,
        IdPStrategy,
        IdPOptionalGuard,
        IdPOptionalStrategy,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    mockLectureService = moduleRef.get(LectureService);
    mockLectureRepository = moduleRef.get(LectureRepository);
    mockUserService = moduleRef.get(UserService);
    mockIdPService = moduleRef.get(IdpService);

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
      const ServiceResult: ExpandedLecture[] = [
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
              year: 2024,
              semester: 'FALL',
              capacity: 1,
              fullCapacityTime: 31,
              registrationCount: 1,
              LectureSectionProfessor: [
                {
                  lectureId: 1,
                  sectionId: 1,
                  year: 2024,
                  semester: 'FALL',
                  professorId: 1,
                  Professor: {
                    id: 1,
                    name: 'test',
                  },
                },
              ],
            },
          ],
        },
      ];

      mockLectureService.getAll.mockResolvedValue(ServiceResult);

      const result = await request(app.getHttpServer())
        .get('/lecture')
        .query({
          professorName: 'test',
        })
        .send();

      expect(result.status).toBe(200);
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
            name: `contains ${keyword}.`,
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
                year: 2024,
                semester: 'FALL',
                capacity: 1,
                fullCapacityTime: 31,
                registrationCount: 1,
                LectureSectionProfessor: [
                  {
                    lectureId: 1,
                    sectionId: 1,
                    year: 2024,
                    semester: 'FALL',
                    professorId: 1,
                    Professor: {
                      id: 1,
                      name: 'test',
                    },
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
            name: `contains ${keyword}.`,
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
                year: 2024,
                semester: 'FALL',
                capacity: 1,
                fullCapacityTime: 31,
                registrationCount: 1,
                LectureSectionProfessor: [
                  {
                    lectureId: 1,
                    sectionId: 1,
                    year: 2024,
                    semester: 'FALL',
                    professorId: 1,
                    Professor: {
                      id: 1,
                      name: 'test',
                    },
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
      expect(result.body[0].lectureCode[0]).toContain('keyword');
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
      const expectResult: ExpandedLecture = {
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
            year: 2024,
            semester: 'FALL',
            capacity: 1,
            fullCapacityTime: 31,
            registrationCount: 1,
            LectureSectionProfessor: [
              {
                lectureId: 1,
                sectionId: 1,
                year: 2024,
                semester: 'FALL',
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

      mockLectureService.getOne.mockResolvedValue(expectResult);

      const result = await request(app.getHttpServer())
        .get('/lecture/1')
        .send();

      expect(result.status).toBe(200);
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

  describe('addBookMark', () => {
    const userInfo: UserInfo = {
      uuid: 'uuid',
      email: 'email',
      name: 'name',
      phoneNumber: 'phoneNumber',
      studentNumber: 'studentNumber',
    };

    const user: User = {
      uuid: 'uuid',
      name: 'name',
      consent: true,
      createdAt: new Date(),
    };
    const mockQuery: BookMarkQueryDto = {
      lectureId: 1,
      sectionId: 2,
      year: 2024,
      semester: 'FALL',
    };

    it('should create BookMark', async () => {
      const expectedResult: BookMark = {
        lectureId: 1,
        sectionId: 2,
        userUuid: 'uuid',
        year: 2024,
        semester: 'FALL',
      };

      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.addBookMark.mockResolvedValue(expectedResult);

      const result = await request(app.getHttpServer())
        .post('/lecture/bookmark')
        .query(mockQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(201);
      expect(result.body.lectureId).toBe(expectedResult.lectureId);
      expect(result.body.sectionId).toBe(expectedResult.sectionId);
      expect(result.body.userUuid).toBe(expectedResult.userUuid);
    });

    it('should 400 error when lectureId or sectionId is invalid type', async () => {
      const mockInvalidQuery = {
        lectureId: 'invalid type',
        sectionId: 2,
      };
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.addBookMark.mockRejectedValue(
        new BadRequestException(),
      );

      const result = await request(app.getHttpServer())
        .post('/lecture/bookmark')
        .query(mockInvalidQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(400);
    });

    it('should 400 error when query is invalid type', async () => {
      const mockInvalidQuery = {
        lectureId: 1,
        sectionId: 'invalid type',
      };

      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.addBookMark.mockRejectedValue(
        new BadRequestException(),
      );
      const result = await request(app.getHttpServer())
        .post('/lecture/bookmark')
        .query(mockInvalidQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(400);
    });

    it('should 404 error when invalid ID', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.addBookMark.mockRejectedValue(new NotFoundException());

      const result = await request(app.getHttpServer())
        .post('/lecture/bookmark')
        .query(mockQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(404);
    });

    it('should 500 error when unexpected database error occurred', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.addBookMark.mockRejectedValue(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .post('/lecture/bookmark')
        .query(mockQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(500);
    });

    it('should 500 error when unexpected error occurred', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.addBookMark.mockRejectedValue(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .post('/lecture/bookmark')
        .query(mockQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(500);
    });
  });

  describe('deleteBookMark', () => {
    const userInfo: UserInfo = {
      uuid: 'uuid',
      email: 'email',
      name: 'name',
      phoneNumber: 'phoneNumber',
      studentNumber: 'studentNumber',
    };

    const user: User = {
      uuid: 'uuid',
      name: 'name',
      consent: true,
      createdAt: new Date(),
    };
    const mockQuery: BookMarkQueryDto = {
      lectureId: 1,
      sectionId: 2,
      year: 2024,
      semester: 'FALL',
    };

    it('should delete BookMark', async () => {
      const expectedResult: BookMark = {
        lectureId: 1,
        sectionId: 2,
        userUuid: 'uuid',
        year: 2024,
        semester: 'FALL',
      };

      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.deleteBookMark.mockResolvedValue(expectedResult);

      const result = await request(app.getHttpServer())
        .delete('/lecture/bookmark')
        .query(mockQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(200);
      expect(result.body.lectureId).toBe(expectedResult.lectureId);
      expect(result.body.sectionId).toBe(expectedResult.sectionId);
      expect(result.body.userUuid).toBe(expectedResult.userUuid);
    });

    it('should 400 error when lectureId is invalid type', async () => {
      const mockInvalidQuery = {
        lectureId: 'invalid type',
        sectionId: 2,
      };

      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.deleteBookMark.mockRejectedValue(
        new BadRequestException(),
      );
      const result = await request(app.getHttpServer())
        .delete('/lecture/bookmark')
        .query(mockInvalidQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(400);
    });

    it('should 400 error when sectionId is invalid type', async () => {
      const mockInvalidQuery = {
        lectureId: 1,
        sectionId: 'invalid type',
      };

      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.deleteBookMark.mockRejectedValue(
        new BadRequestException(),
      );
      const result = await request(app.getHttpServer())
        .delete('/lecture/bookmark')
        .query(mockInvalidQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(400);
    });

    it('should 404 error when invalid ID', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.deleteBookMark.mockRejectedValue(
        new NotFoundException(),
      );

      const result = await request(app.getHttpServer())
        .delete('/lecture/bookmark')
        .query(mockQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(404);
    });

    it('should 500 error when unexpected database error occurred', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.deleteBookMark.mockRejectedValue(
        new InternalServerErrorException('Unexpected Database Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .delete('/lecture/bookmark')
        .query(mockQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(500);
    });

    it('should 500 error when unexpected error occurred', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.deleteBookMark.mockRejectedValue(
        new InternalServerErrorException('Unexpected Error Occurred'),
      );

      const result = await request(app.getHttpServer())
        .delete('/lecture/bookmark')
        .query(mockQuery)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(500);
    });
  });

  describe('getBookMark', () => {
    const userInfo: UserInfo = {
      uuid: 'uuid',
      email: 'email',
      name: 'name',
      phoneNumber: 'phoneNumber',
      studentNumber: 'studentNumber',
    };

    const user: User = {
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

      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.getBookMark.mockResolvedValue(expectedResult);

      const result = await request(app.getHttpServer())
        .get('/lecture/bookmark')
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(200);
      expect(result.body[0].lectureId).toBe(expectedResult[0].lectureId);
      expect(result.body[0].sectionId).toBe(expectedResult[0].sectionId);
      expect(result.body[0].userUuid).toBe(expectedResult[0].userUuid);
      expect(result.body[1].lectureId).toBe(expectedResult[1].lectureId);
      expect(result.body[1].sectionId).toBe(expectedResult[1].sectionId);
      expect(result.body[1].userUuid).toBe(expectedResult[1].userUuid);
    });

    it('should 404 error when invalid ID', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.getBookMark.mockRejectedValue(new NotFoundException());

      const result = await request(app.getHttpServer())
        .get('/lecture/bookmark')
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(404);
    });

    it('should 500 error when unexpected database error occurred', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.getBookMark.mockRejectedValue(new Error());

      const result = await request(app.getHttpServer())
        .get('/lecture/bookmark')
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(500);
    });

    it('should 500 error when unexpected error occurred', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockLectureService.getBookMark.mockRejectedValue(new Error());

      const result = await request(app.getHttpServer())
        .get('/lecture/bookmark')
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(500);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
