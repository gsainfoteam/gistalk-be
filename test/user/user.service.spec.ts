import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { IdpService } from 'src/idp/idp.service';
import { IdpJwtResponse } from 'src/idp/types/idp.type';
import { UserInfo } from 'src/idp/types/userInfo.type';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';

describe('UserService', () => {
  let service: UserService;
  let mockIdpService: DeepMockProxy<IdpService>;
  let mockConfigService: DeepMockProxy<ConfigService>;
  let mockUserRepository: DeepMockProxy<UserRepository>;

  beforeEach(async () => {
    const mockModule: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: IdpService,
          useValue: mockDeep<IdpService>(),
        },
        {
          provide: ConfigService,
          useValue: mockDeep<ConfigService>(),
        },
        {
          provide: UserRepository,
          useValue: mockDeep<UserRepository>(),
        },
      ],
    }).compile();

    service = mockModule.get<UserService>(UserService);
    mockIdpService = mockModule.get(IdpService);
    mockConfigService = mockModule.get(ConfigService);
    mockUserRepository = mockModule.get(UserRepository);
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(service.login).toBeDefined();
    });

    it('should throw BadRequestException when code or type is not provided', async () => {
      await expect(service.login({ code: '' })).rejects.toThrow(
        new BadRequestException('invalid code or type'),
      );
    });

    // mock data
    const tokens: IdpJwtResponse = {
      access_token: 'access token',
      refresh_token: 'refresh token',
    };
    const userInfo: UserInfo = {
      uuid: 'uuid',
      name: 'name',
      email: 'email',
      phoneNumber: 'phoneNumber',
      studentNumber: 'studentNumber',
    };
    const user: User = {
      uuid: 'uuid',
      name: 'name',
      consent: false,
      createdAt: new Date(),
    };

    it('should call idpService.getAccessTokenFromIdP, idpService.getUserInfo, and userRepository.findUserOrCreate', async () => {
      mockConfigService.getOrThrow.mockReturnValue('redirect uri');
      mockIdpService.getAccessTokenFromIdP.mockResolvedValue(tokens);
      mockIdpService.getUserInfo.mockResolvedValue(userInfo);
      mockUserRepository.findUserOrCreate.mockResolvedValue(user);
      await service.login({ code: 'code', type: 'type' });
      expect(mockIdpService.getUserInfo).toHaveBeenCalled();
      expect(mockIdpService.getAccessTokenFromIdP).toHaveBeenCalled();
      expect(mockUserRepository.findUserOrCreate).toHaveBeenCalled();
    });

    it('should return tokens and consent_required', async () => {
      mockConfigService.getOrThrow.mockReturnValue('redirect uri');
      mockIdpService.getAccessTokenFromIdP.mockResolvedValue(tokens);
      mockIdpService.getUserInfo.mockResolvedValue(userInfo);
      mockUserRepository.findUserOrCreate.mockResolvedValue(user);
      const result = await service.login({ code: 'code', type: 'type' });
      expect(result).toEqual({
        ...tokens,
        consent_required: !user.consent,
      });
    });

    it('should throw error when idpService.getAccessTokenFromIdP throws error', async () => {
      mockConfigService.getOrThrow.mockReturnValue('redirect uri');
      mockIdpService.getAccessTokenFromIdP.mockRejectedValue(new Error());
      await expect(
        service.login({ code: 'code', type: 'type' }),
      ).rejects.toThrow();
    });

    it('should throw error when idpService.getUserInfo throws error', async () => {
      mockConfigService.getOrThrow.mockReturnValue('redirect uri');
      mockIdpService.getAccessTokenFromIdP.mockResolvedValue(tokens);
      mockIdpService.getUserInfo.mockRejectedValue(new Error());
      await expect(
        service.login({ code: 'code', type: 'type' }),
      ).rejects.toThrow();
    });

    it('should throw error when userRepository.findUserOrCreate throws error', async () => {
      mockConfigService.getOrThrow.mockReturnValue('redirect uri');
      mockIdpService.getAccessTokenFromIdP.mockResolvedValue(tokens);
      mockIdpService.getUserInfo.mockResolvedValue(userInfo);
      mockUserRepository.findUserOrCreate.mockRejectedValue(new Error());
      await expect(
        service.login({ code: 'code', type: 'type' }),
      ).rejects.toThrow();
    });
  });

  describe('refresh', () => {
    it('should be defined', () => {
      expect(service.refresh).toBeDefined();
    });

    // mock data
    const tokens: IdpJwtResponse = {
      access_token: 'access token',
      refresh_token: 'refresh token',
    };
    const userData: UserInfo = {
      uuid: 'uuid',
      name: 'name',
      email: 'email',
      phoneNumber: 'phoneNumber',
      studentNumber: 'studentNumber',
    };
    const user: User = {
      uuid: 'uuid',
      name: 'name',
      consent: false,
      createdAt: new Date(),
    };

    it('should call idpService.refreshToken, idpService.getUserInfo, and userRepository.findUserOrCreate', async () => {
      mockIdpService.refreshToken.mockResolvedValue(tokens);
      mockIdpService.getUserInfo.mockResolvedValue(userData);
      mockUserRepository.findUserOrCreate.mockResolvedValue(user);
      await service.refresh('refresh token');
      expect(mockIdpService.refreshToken).toHaveBeenCalled();
      expect(mockIdpService.getUserInfo).toHaveBeenCalled();
      expect(mockUserRepository.findUserOrCreate).toHaveBeenCalled();
    });

    it('should return tokens and consent_required', async () => {
      mockIdpService.refreshToken.mockResolvedValue(tokens);
      mockIdpService.getUserInfo.mockResolvedValue(userData);
      mockUserRepository.findUserOrCreate.mockResolvedValue(user);
      const result = await service.refresh('refresh token');
      expect(result).toEqual({
        ...tokens,
        consent_required: !user.consent,
      });
    });

    it('should throw error when idpService.refreshToken throws error', async () => {
      mockIdpService.refreshToken.mockRejectedValue(new Error());
      await expect(service.refresh('refresh token')).rejects.toThrow();
    });

    it('should throw error when idpService.getUserInfo throws error', async () => {
      mockIdpService.refreshToken.mockResolvedValue(tokens);
      mockIdpService.getUserInfo.mockRejectedValue(new Error());
      await expect(service.refresh('refresh token')).rejects.toThrow();
    });

    it('should throw error when userRepository.findUserOrCreate throws error', async () => {
      mockIdpService.refreshToken.mockResolvedValue(tokens);
      mockIdpService.getUserInfo.mockResolvedValue(userData);
      mockUserRepository.findUserOrCreate.mockRejectedValue(new Error());
      await expect(service.refresh('refresh token')).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should be defined', () => {
      expect(service.logout).toBeDefined();
    });

    it('should call idpService.revokeToken twice', async () => {
      await service.logout('access token', 'refresh token');
      expect(mockIdpService.revokeToken).toHaveBeenCalledTimes(2);
    });

    it('should throw error when idpService.revokeToken throws error', async () => {
      mockIdpService.revokeToken.mockRejectedValue(new Error());
      await expect(
        service.logout('access token', 'refresh token'),
      ).rejects.toThrow();
    });
  });

  describe('setConsent', () => {
    it('should be defined', () => {
      expect(service.setConsent).toBeDefined();
    });

    it('should call userRepository.setConsent', async () => {
      const user: User = {
        uuid: 'uuid',
        name: 'name',
        consent: false,
        createdAt: new Date(),
      };
      await service.setConsent(user);
      expect(mockUserRepository.setConsent).toHaveBeenCalled();
    });

    it('should throw error when userRepository.setConsent throws error', async () => {
      mockUserRepository.setConsent.mockRejectedValue(new Error());
      await expect(service.setConsent({} as User)).rejects.toThrow();
    });
  });

  describe('findUserOrCreate', () => {
    it('should be defined', () => {
      expect(service.findUserOrCreate).toBeDefined();
    });

    const user: User = {
      uuid: 'uuid',
      name: 'name',
      consent: false,
      createdAt: new Date(),
    };

    it('should return user', async () => {
      mockUserRepository.findUserOrCreate.mockResolvedValue(user);
      expect(await service.findUserOrCreate(user)).toEqual(user);
    });

    it('should throw error when userRepository.findUserOrCreate throws error', async () => {
      mockUserRepository.findUserOrCreate.mockRejectedValue(new Error());
      await expect(service.findUserOrCreate(user)).rejects.toThrow();
    });
  });
});
