import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { IdpService } from '../../src/idp/idp.service';
import { Test, TestingModule } from '@nestjs/testing';
import { IdPGuard, IdPOptionalGuard } from '../../src/user/guard/idp.guard';
import { IdPStrategy } from '../../src/user/guard/idp.strategy';
import * as request from 'supertest';
import { UserInfo } from '../../src/idp/types/userInfo.type';
import { RecordLike, User } from '@prisma/client';
import { RecordService } from '../../src/record/record.service';
import { RecordController } from '../../src/record/record.controller';
import { RecordResDto } from '../../src/record/dto/res/recordRes.dto';
import { CreateRecordBodyDto } from '../../src/record/dto/req/createRecordBody.dto';
import { UpdateRecordBodyDto } from '../../src/record/dto/req/updateRecordBody.dto';
import { UserService } from '../../src/user/user.service';
import { IdPOptionalStrategy } from '../../src/user/guard/idpOptional.strategy';
import { ExpandedRecordResDto } from 'src/record/dto/res/expandedRes.dto';

describe('RecordController Integration Test', () => {
  let app: INestApplication;
  let mockRecordService: DeepMockProxy<RecordService>;
  let mockIdPService: DeepMockProxy<IdpService>;
  let mockUserService: DeepMockProxy<UserService>;

  beforeEach(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      controllers: [RecordController],
      providers: [
        {
          provide: RecordService,
          useValue: mockDeep<RecordService>(),
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

    app = mockModule.createNestApplication();
    mockRecordService = mockModule.get(RecordService);
    mockIdPService = mockModule.get(IdpService);
    mockUserService = mockModule.get(UserService);
    await app.init();
  });

  describe('getRecordList', () => {
    const userInfo: UserInfo = {
      uuid: 'test',
      email: 'test',
      name: 'test',
      phoneNumber: 'test',
      studentNumber: 'test',
    };

    const user: User = {
      uuid: 'test',
      name: 'test',
      consent: true,
      createdAt: new Date(),
    };

    const recordResult: ExpandedRecordResDto[] = [
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
          id: 1,
          lectureId: 253,
          Lecture: {
            id: 253,
            name: 'test',
          },
          Professor: [
            {
              id: 1,
              name: 'test',
            },
          ],
        },
      },
    ];

    it('should return record list', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.getRecordList.mockResolvedValue(recordResult);
      const result = await request(app.getHttpServer())
        .get('/record')
        .query({
          type: 'evaluation',
        })
        .set('Authorization', 'Bearer test')
        .send();
      expect(result.status).toBe(200);
      expect(result.body.toString()).toEqual(recordResult.toString());
    });

    it('should 400 error when type is not valid', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      const result = await request(app.getHttpServer())
        .get('/record')
        .query({
          type: 'invalid',
        })
        .set('Authorization', 'Bearer test')
        .send();
      expect(result.status).toBe(400);
    });

    it('should 401 error when service throw UnauthorizedException', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.getRecordList.mockRejectedValue(
        new UnauthorizedException(),
      );
      const result = await request(app.getHttpServer())
        .get('/record')
        .query({
          type: 'recent',
        })
        .set('Authorization', 'Bearer test')
        .send();
      expect(result.status).toBe(401);
    });

    it('should 500 error when service throw error', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.getRecordList.mockRejectedValue(new Error());
      const result = await request(app.getHttpServer())
        .get('/record')
        .query({
          type: 'recent',
        })
        .set('Authorization', 'Bearer test')
        .send();
      expect(result.status).toBe(500);
    });
  });

  describe('createRecord', () => {
    const userInfo: UserInfo = {
      uuid: 'test',
      email: 'test',
      name: 'test',
      phoneNumber: 'test',
      studentNumber: 'test',
    };

    const user: User = {
      uuid: 'test',
      name: 'test',
      consent: true,
      createdAt: new Date(),
    };

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

    const recordResult: RecordResDto = {
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

    it('should create record', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.createRecord.mockResolvedValue(recordResult);

      const result = await request(app.getHttpServer())
        .post('/record')
        .set('Authorization', 'Bearer test')
        .send(body);

      expect(result.status).toBe(201);
      expect(result.body.toString()).toEqual(recordResult.toString());
    });

    it('should 400 error when body is not valid', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.createRecord.mockResolvedValue(recordResult);

      const result = await request(app.getHttpServer())
        .post('/record')
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(400);
    });

    it('should 401 error when service throw UnauthorizedException', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.createRecord.mockRejectedValue(
        new UnauthorizedException(),
      );

      const result = await request(app.getHttpServer())
        .post('/record')
        .set('Authorization', 'Bearer test')
        .send(body);

      expect(result.status).toBe(401);
    });

    it('should 500 error when service throw error', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.createRecord.mockRejectedValue(new Error());

      const result = await request(app.getHttpServer())
        .post('/record')
        .set('Authorization', 'Bearer test')
        .send(body);

      expect(result.status).toBe(500);
    });
  });

  describe('updateRecord', () => {
    const recordId: number = 1;

    const userInfo: UserInfo = {
      uuid: 'test',
      email: 'test',
      name: 'test',
      phoneNumber: 'test',
      studentNumber: 'test',
    };

    const user: User = {
      uuid: 'test',
      name: 'test',
      consent: true,
      createdAt: new Date(),
    };

    const body: UpdateRecordBodyDto = {
      difficulty: 1,
      skill: 1,
      helpfulness: 1,
      interest: 1,
      load: 1,
      generosity: 1,
    };

    const recordResult: RecordResDto = {
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

    it('should update record', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.updateRecord.mockResolvedValue(recordResult);

      const result = await request(app.getHttpServer())
        .patch(`/record/${recordId}`)
        .set('Authorization', 'Bearer test')
        .send(body);

      expect(result.status).toBe(200);
      expect(result.body.toString()).toEqual(recordResult.toString());
    });

    it('should 401 error when service throw UnauthorizedException', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.updateRecord.mockRejectedValue(
        new UnauthorizedException(),
      );
      const result = await request(app.getHttpServer())
        .patch(`/record/${recordId}`)
        .set('Authorization', 'Bearer test')
        .send(body);
      expect(result.status).toBe(401);
    });

    it('should 500 error when service throw error', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.updateRecord.mockRejectedValue(new Error());

      const result = await request(app.getHttpServer())
        .patch(`/record/${recordId}`)
        .set('Authorization', 'Bearer test')
        .send(body);

      expect(result.status).toBe(500);
    });
  });

  describe('createRecordLike', () => {
    const recordId: number = 1;

    const userInfo: UserInfo = {
      uuid: 'test',
      email: 'test',
      name: 'test',
      phoneNumber: 'test',
      studentNumber: 'test',
    };

    const user: User = {
      uuid: 'test',
      name: 'test',
      consent: true,
      createdAt: new Date(),
    };

    const recordLikeResult: RecordLike = {
      id: 1,
      createdAt: new Date(),
      deletedAt: null,
      userUuid: 'uuid',
      recordId: 1,
    };

    it('should create record like', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.createRecordLike.mockResolvedValue(recordLikeResult);

      const result = await request(app.getHttpServer())
        .post(`/record/${recordId}/like`)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(201);
      expect(result.body.toString()).toEqual(recordLikeResult.toString());
    });

    it('should 401 error when service throw UnauthorizedException', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.createRecordLike.mockRejectedValue(
        new UnauthorizedException(),
      );
      const result = await request(app.getHttpServer())
        .post(`/record/${recordId}/like`)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(401);
    });

    it('should 500 error when service throw error', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.createRecordLike.mockRejectedValue(new Error());
      const result = await request(app.getHttpServer())
        .post(`/record/${recordId}/like`)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(500);
    });
  });

  describe('removeRecordLike', () => {
    const recordId: number = 1;

    const userInfo: UserInfo = {
      uuid: 'test',
      email: 'test',
      name: 'test',
      phoneNumber: 'test',
      studentNumber: 'test',
    };

    const user: User = {
      uuid: 'test',
      name: 'test',
      consent: true,
      createdAt: new Date(),
    };

    it('should delete record like', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.removeRecordLike.mockResolvedValue();

      const result = await request(app.getHttpServer())
        .delete(`/record/${recordId}/like`)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(200);
      expect(result.body).toEqual({});
    });

    it('should 401 error when service throw UnauthorizedException', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.removeRecordLike.mockRejectedValue(
        new UnauthorizedException(),
      );
      const result = await request(app.getHttpServer())
        .delete(`/record/${recordId}/like`)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(401);
    });

    it('should 500 error when service throw error', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      mockRecordService.removeRecordLike.mockRejectedValue(new Error());
      const result = await request(app.getHttpServer())
        .delete(`/record/${recordId}/like`)
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(500);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
