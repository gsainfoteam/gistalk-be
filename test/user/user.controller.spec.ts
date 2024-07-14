import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserInfo } from 'src/idp/types/userInfo.type';
import { JwtTokenType } from 'src/user/types/jwtToken.type';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: DeepMockProxy<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockDeep<UserService>(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockUserService = module.get(UserService);
  });

  describe('loginByIdP', () => {
    it('should be defined', () => {
      expect(controller.loginByIdP).toBeDefined();
    });

    it('should return jwt token', async () => {
      const jwtToken: JwtTokenType = {
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        consent_required: false,
      };
      mockUserService.login.mockResolvedValue(jwtToken);
      expect(
        await controller.loginByIdP(
          { code: 'code' },
          { headers: { 'user-agent': 'web' } } as any,
          { cookie: jest.fn() } as any,
        ),
      ).toEqual({ access_token: 'accessToken', consent_required: false });
    });

    it('should throw error when userService.login throw error', async () => {
      mockUserService.login.mockRejectedValue(new Error());
      await expect(
        controller.loginByIdP(
          { code: 'code' },
          { headers: { 'user-agent': 'web' } } as any,
          { cookie: jest.fn() } as any,
        ),
      ).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should be defined', () => {
      expect(controller.refreshToken).toBeDefined();
    });

    it('should return jwt token', async () => {
      const jwtToken: JwtTokenType = {
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        consent_required: false,
      };
      mockUserService.refresh.mockResolvedValue(jwtToken);
      expect(
        await controller.refreshToken(
          { cookies: { refresh_token: 'refreshToken' } } as any,
          { cookie: jest.fn() } as any,
        ),
      ).toEqual({ access_token: 'accessToken', consent_required: false });
    });

    it('should throw error when userService.refresh throw error', async () => {
      mockUserService.refresh.mockRejectedValue(new Error());
      await expect(
        controller.refreshToken(
          { cookies: { refresh_token: 'refreshToken' } } as any,
          { cookie: jest.fn() } as any,
        ),
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should be defined', () => {
      expect(controller.logout).toBeDefined();
    });

    it('should complete with void', async () => {
      mockUserService.logout.mockResolvedValue();
      expect(
        await controller.logout(
          { access_token: 'accessToken' },
          { cookies: { refresh_token: 'refreshToken' } } as any,
          { clearCookie: jest.fn() } as any,
        ),
      ).toBeUndefined();
    });

    it('should throw error when userService.logout throw error', async () => {
      mockUserService.logout.mockRejectedValue(new Error());
      await expect(
        controller.logout(
          { access_token: 'accessToken' },
          { cookies: { refresh_token: 'refreshToken' } } as any,
          { clearCookie: jest.fn() } as any,
        ),
      ).rejects.toThrow();
    });
  });

  describe('setConsent', () => {
    it('should be defined', () => {
      expect(controller.setConsent).toBeDefined();
    });

    it('should complete with void', async () => {
      mockUserService.setConsent.mockResolvedValue();
      expect(await controller.setConsent({} as any)).toBeUndefined();
    });

    it('should throw error when userService.setConsent throw error', async () => {
      mockUserService.setConsent.mockRejectedValue(new Error());
      await expect(controller.setConsent({} as any)).rejects.toThrow();
    });
  });

  describe('getUserInfo', () => {
    it('should be defined', () => {
      expect(controller.getUserInfo).toBeDefined();
    });

    it('should return user', async () => {
      const user: UserInfo = {
        uuid: 'uuid',
        email: 'email',
        name: 'name',
        phoneNumber: 'phoneNumber',
        studentNumber: 'studentNumber',
      };
      expect(await controller.getUserInfo(user)).toEqual(user);
    });
  });
});
