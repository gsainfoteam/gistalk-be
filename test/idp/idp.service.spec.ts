import { HttpService } from '@nestjs/axios';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AxiosError, AxiosResponse } from 'axios';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Observable } from 'rxjs';
import { IdpService } from 'src/idp/idp.service';
import { IdpJwtResponse } from 'src/idp/types/idp.type';

describe('IdpService', () => {
  let idpService: IdpService;
  let mockHttpService: DeepMockProxy<HttpService>;
  let mockConfigService: DeepMockProxy<ConfigService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        IdpService,
        {
          provide: HttpService,
          useValue: mockDeep<HttpService>(),
        },
        {
          provide: ConfigService,
          useValue: mockDeep<ConfigService>(),
        },
      ],
    }).compile();

    idpService = moduleRef.get<IdpService>(IdpService);
    mockHttpService = moduleRef.get(HttpService);
    mockConfigService = moduleRef.get(ConfigService);
  });

  it('should be defined', async () => {
    expect(idpService).toBeDefined();
    expect(mockHttpService).toBeDefined();
    expect(mockConfigService).toBeDefined();
  });

  it('should have idpUrl', async () => {
    mockConfigService.getOrThrow.mockReturnValue('IDP_URL');

    expect(mockConfigService.getOrThrow).toBeDefined();
  });

  it('should throw error if mockConfigService.getOrThrow throws error', async () => {
    mockConfigService.getOrThrow.mockImplementation(() => {
      throw new Error();
    });

    expect(mockConfigService.getOrThrow).toThrow(Error);
  });

  describe('getAccessTokenFromIdp', () => {
    it('should return accessToken', async () => {
      const response = {
        data: {
          access_token: 'accessToken',
          refresh_token: 'refreshToken',
        },
      };

      mockHttpService.post.mockImplementation(() => {
        return new Observable<AxiosResponse<IdpJwtResponse>>((observer) => {
          observer.next(response as any);
        });
      });

      const result = await idpService.getAccessTokenFromIdP(
        'code',
        'redirectUri',
      );

      expect(result.access_token).toEqual(response.data.access_token);
    });

    it('should throw UnauthorizedException when mockHttpService.post throws AxiosError with response.status is 401', async () => {
      const axiosError = new AxiosError('Unauthorized', {
        data: 'Unauthorized',
        response: { status: 401 },
      } as any);

      mockHttpService.post.mockImplementation(() => {
        throw axiosError;
      });

      expect(
        idpService.getAccessTokenFromIdP('code', 'redirectUri'),
      ).rejects.toThrow(new UnauthorizedException());
    });

    it('should throw InternalServerErrorException when mockHttpService.post throws AxiosError but not with response.status 401', async () => {
      const axiosError = new AxiosError('Internal Server Error', {
        data: 'Internal Server Error',
        response: { status: 500 },
      } as any);

      mockHttpService.post.mockImplementation(() => {
        throw axiosError;
      });

      expect(
        idpService.getAccessTokenFromIdP('code', 'redirectUri'),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe('refreshToken', () => {
    it('should refresh token', async () => {
      const response = {
        data: {
          access_token: 'accessToken',
          refresh_token: 'refreshToken',
        },
      };

      mockHttpService.post.mockImplementation(() => {
        return new Observable<AxiosResponse<IdpJwtResponse>>((observer) => {
          observer.next(response as any);
        });
      });

      const result = await idpService.refreshToken('refreshToken');

      expect(result.refresh_token).toEqual(response.data.refresh_token);
    });

    it('should throw UnauthorizedException when mockHttpService.post throws AxiosError with response.status is 401', async () => {
      const axiosError = new AxiosError('Unauthorized', {
        data: 'Unauthorized',
        response: { status: 401 },
      } as any);

      mockHttpService.post.mockImplementation(() => {
        throw axiosError;
      });

      expect(
        idpService.getAccessTokenFromIdP('code', 'redirectUri'),
      ).rejects.toThrow(new UnauthorizedException());
    });

    it('should throw InternalServerErrorException when mockHttpService.post throws AxiosError but not with response.status 401', async () => {
      const axiosError = new AxiosError('Internal Server Error', {
        data: 'Internal Server Error',
        response: { status: 500 },
      } as any);

      mockHttpService.post.mockImplementation(() => {
        throw axiosError;
      });

      expect(
        idpService.getAccessTokenFromIdP('code', 'redirectUri'),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe('getUserInfo', () => {
    it('should return user info', async () => {
      const response = {
        data: {
          uuid: 'uuid',
          email: 'email',
          name: 'name',
          phone_number: 'phoneNumber',
          student_id: 'studentNumber',
        },
      };

      mockHttpService.get.mockImplementation(() => {
        return new Observable<AxiosResponse<any>>((observer) => {
          observer.next(response as any);
        });
      });

      const result = await idpService.getUserInfo('accessToken');

      expect(result.uuid).toEqual(response.data.uuid);
      expect(result.name).toEqual(response.data.name);
      expect(result.email).toEqual(response.data.email);
      expect(result.phoneNumber).toEqual(response.data.phone_number);
      expect(result.studentNumber).toEqual(response.data.student_id);
    });

    it('should throw UnauthorizedException when mockHttpService.post throws AxiosError with response.status is 401', async () => {
      const axiosError = new AxiosError('Unauthorized', {
        data: 'Unauthorized',
        response: { status: 401 },
      } as any);

      mockHttpService.post.mockImplementation(() => {
        throw axiosError;
      });

      expect(
        idpService.getAccessTokenFromIdP('code', 'redirectUri'),
      ).rejects.toThrow(new UnauthorizedException());
    });

    it('should throw InternalServerErrorException when mockHttpService.post throws AxiosError but not with response.status 401', async () => {
      const axiosError = new AxiosError('Internal Server Error', {
        data: 'Internal Server Error',
        response: { status: 500 },
      } as any);

      mockHttpService.post.mockImplementation(() => {
        throw axiosError;
      });

      expect(
        idpService.getAccessTokenFromIdP('code', 'redirectUri'),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });

  describe('revokeToken', () => {
    it('should call mockHttpService.post', async () => {
      const response = {
        data: {},
      };

      mockHttpService.post.mockImplementation(() => {
        return new Observable<AxiosResponse<any>>((observer) => {
          observer.next(response as any);
        });
      });

      await idpService.revokeToken('token');

      expect(mockHttpService.post).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when mockHttpService.post throws AxiosError with response.status is 401', async () => {
      const axiosError = new AxiosError('Unauthorized', {
        data: 'Unauthorized',
        response: { status: 401 },
      } as any);

      mockHttpService.post.mockImplementation(() => {
        throw axiosError;
      });

      expect(
        idpService.getAccessTokenFromIdP('code', 'redirectUri'),
      ).rejects.toThrow(new UnauthorizedException());
    });

    it('should throw InternalServerErrorException when mockHttpService.post throws AxiosError but not with response.status 401', async () => {
      const axiosError = new AxiosError('Internal Server Error', {
        data: 'Internal Server Error',
        response: { status: 500 },
      } as any);

      mockHttpService.post.mockImplementation(() => {
        throw axiosError;
      });

      expect(
        idpService.getAccessTokenFromIdP('code', 'redirectUri'),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });
});
