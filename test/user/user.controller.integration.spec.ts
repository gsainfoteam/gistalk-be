import * as request from 'supertest';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { JwtTokenType } from 'src/user/types/jwtToken.type';
import { IdPGuard } from 'src/user/guard/idp.guard';
import * as cookieParser from 'cookie-parser';
import { IdpService } from 'src/idp/idp.service';
import { UserInfo } from 'src/idp/types/userInfo.type';
import { User } from '@prisma/client';
import { IdPStrategy } from 'src/user/guard/idp.strategy';

describe('UserController Integration Test', () => {
  let app: INestApplication;
  let mockUserService: DeepMockProxy<UserService>;
  let mockIdPService: DeepMockProxy<IdpService>;

  beforeEach(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockDeep<UserService>(),
        },
        IdPGuard,
        {
          provide: IdpService,
          useValue: mockDeep<IdpService>(),
        },
        IdPStrategy,
      ],
    }).compile();

    app = mockModule.createNestApplication();
    app.use(cookieParser());
    mockUserService = mockModule.get(UserService);
    mockIdPService = mockModule.get(IdpService);
    await app.init();
  });

  describe('loginByIdP', () => {
    const jwtToken: JwtTokenType = {
      access_token: 'test',
      refresh_token: 'test',
      consent_required: true,
    };
    it('should return jwt token', async () => {
      mockUserService.login.mockResolvedValue(jwtToken);
      const result = await request(app.getHttpServer())
        .get('/user/login')
        .query({
          code: 'test',
          type: 'web',
        })
        .send();
      expect(result.status).toBe(200);
      expect(result.body).toEqual({
        access_token: 'test',
        consent_required: true,
      });
      expect(result.header['set-cookie']).toBeDefined();
      expect(result.header['set-cookie'][0].split('; ')).toContain(
        'refresh_token=test',
      );
    });

    it('should return jwt token with default type', async () => {
      mockUserService.login.mockResolvedValue(jwtToken);
      const result = await request(app.getHttpServer())
        .get('/user/login')
        .query({
          code: 'test',
        })
        .set('user-agent', 'chrome')
        .send();
      expect(result.status).toBe(200);
      expect(result.body).toEqual({
        access_token: 'test',
        consent_required: true,
      });
      expect(result.header['set-cookie']).toBeDefined();
      expect(result.header['set-cookie'][0].split('; ')).toContain(
        'refresh_token=test',
      );
    });

    it('should 400 error when code is not provided', async () => {
      const result = await request(app.getHttpServer())
        .get('/user/login')
        .send();
      expect(result.status).toBe(400);
    });

    it('should 400 error when type is not valid', async () => {
      const result = await request(app.getHttpServer())
        .get('/user/login')
        .query({
          code: 'test',
          type: 'invalid',
        })
        .send();
      expect(result.status).toBe(400);
    });

    it('should 401 error when service throw UnauthorizedException', async () => {
      mockUserService.login.mockRejectedValue(new UnauthorizedException());
      const result = await request(app.getHttpServer())
        .get('/user/login')
        .query({
          code: 'test',
        })
        .set('user-agent', 'chrome')
        .send();
      expect(result.status).toBe(401);
    });

    it('should 500 error when service throw error', async () => {
      mockUserService.login.mockRejectedValue(new Error());
      const result = await request(app.getHttpServer())
        .get('/user/login')
        .query({
          code: 'test',
        })
        .set('user-agent', 'chrome')
        .send();
      expect(result.status).toBe(500);
    });
  });

  describe('refreshToken', () => {
    const jwtToken: JwtTokenType = {
      access_token: 'test',
      refresh_token: 'test',
      consent_required: true,
    };
    it('should return jwt token', async () => {
      mockUserService.refresh.mockResolvedValue(jwtToken);
      const result = await request(app.getHttpServer())
        .post('/user/refresh')
        .set('Cookie', 'refresh_token=test')
        .send();
      expect(result.status).toBe(201);
      expect(result.body).toEqual({
        access_token: 'test',
        consent_required: true,
      });
      expect(result.header['set-cookie']).toBeDefined();
      expect(result.header['set-cookie'][0].split('; ')).toContain(
        'refresh_token=test',
      );
    });

    it('should 401 error when refresh token is not provided', async () => {
      const result = await request(app.getHttpServer())
        .post('/user/refresh')
        .send();
      expect(result.status).toBe(401);
    });

    it('should 401 error when service throw UnauthorizedException', async () => {
      mockUserService.refresh.mockRejectedValue(new UnauthorizedException());
      const result = await request(app.getHttpServer())
        .post('/user/refresh')
        .set('Cookie', 'refresh_token=test')
        .send();
      expect(result.status).toBe(401);
    });

    it('should 500 error when service throw error', async () => {
      mockUserService.refresh.mockRejectedValue(new Error());
      const result = await request(app.getHttpServer())
        .post('/user/refresh')
        .set('Cookie', 'refresh_token=test')
        .send();
      expect(result.status).toBe(500);
    });
  });

  describe('logout', () => {
    it('should return 201', async () => {
      mockUserService.logout.mockResolvedValue();
      const result = await request(app.getHttpServer())
        .post('/user/logout')
        .set('Cookie', 'refresh_token=test')
        .send({
          access_token: 'test',
        });
      expect(result.status).toBe(201);
      expect(result.header['set-cookie']).toBeDefined();
      expect(result.header['set-cookie'][0].split('; ')).toContain(
        'refresh_token=',
      );
    });

    it('should 400 error when refresh token and access token is not provided', async () => {
      const result = await request(app.getHttpServer())
        .post('/user/logout')
        .send();
      expect(result.status).toBe(400);
    });

    it('should 400 error when refresh token is not provided', async () => {
      const result = await request(app.getHttpServer())
        .post('/user/logout')
        .send({
          access_token: 'test',
        });
      expect(result.status).toBe(400);
    });

    it('should 401 error when service throw UnauthorizedException', async () => {
      mockUserService.logout.mockRejectedValue(new UnauthorizedException());
      const result = await request(app.getHttpServer())
        .post('/user/logout')
        .set('Cookie', 'refresh_token=test')
        .send({
          access_token: 'test',
        });
      expect(result.status).toBe(401);
    });

    it('should 500 error when service throw error', async () => {
      mockUserService.logout.mockRejectedValue(new Error());
      const result = await request(app.getHttpServer())
        .post('/user/logout')
        .set('Cookie', 'refresh_token=test')
        .send({
          access_token: 'test',
        });
      expect(result.status).toBe(500);
    });
  });

  describe('consent', () => {
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
    it('should return 200', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.setConsent.mockResolvedValue();
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      const result = await request(app.getHttpServer())
        .post('/user/consent')
        .set('Authorization', 'Bearer test')
        .send();
      expect(result.status).toBe(201);
    });

    it('should 401 error when user is not vaild', async () => {
      mockIdPService.getUserInfo.mockRejectedValue(new UnauthorizedException());
      const result = await request(app.getHttpServer())
        .post('/user/consent')
        .set('Authorization', 'Bearer test')
        .send();
      expect(result.status).toBe(401);
    });

    it('should 401 error when service throw UnauthorizedException', async () => {
      mockUserService.setConsent.mockRejectedValue(new UnauthorizedException());
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      const result = await request(app.getHttpServer())
        .post('/user/consent')
        .set('Authorization', 'Bearer test')
        .send();
      expect(result.status).toBe(401);
    });

    it('should 500 error when service throw error', async () => {
      mockUserService.setConsent.mockRejectedValue(new Error());
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      const result = await request(app.getHttpServer())
        .post('/user/consent')
        .set('Authorization', 'Bearer test')
        .send();
      expect(result.status).toBe(500);
    });
  });

  describe('getUserInfo', () => {
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

    it('should return user info', async () => {
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      mockUserService.findUserOrCreate.mockResolvedValue(user);
      const result = await request(app.getHttpServer())
        .get('/user/info')
        .set('Authorization', 'Bearer test')
        .send();

      expect(result.status).toBe(200);
      expect(result.body).toEqual(userInfo);
    });

    it('should 401 error when user is not vaild', async () => {
      mockIdPService.getUserInfo.mockRejectedValue(new UnauthorizedException());
      const result = await request(app.getHttpServer())
        .get('/user/info')
        .set('Authorization', 'Bearer test')
        .send();
      expect(result.status).toBe(401);
    });

    it('should 401 error when service throw error', async () => {
      mockUserService.findUserOrCreate.mockRejectedValue(new Error());
      mockIdPService.getUserInfo.mockResolvedValue(userInfo);
      const result = await request(app.getHttpServer())
        .get('/user/info')
        .set('Authorization', 'Bearer test')
        .send();
      expect(result.status).toBe(401);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
