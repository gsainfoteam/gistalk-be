import { HttpService } from '@nestjs/axios';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import axios, { AxiosError, AxiosResponse } from 'axios';
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
      const axiosInstance = axios.create();
      const response: AxiosResponse<IdpJwtResponse> = await axiosInstance.post(
        'url',
        {
          data: { access_token: 'accessToken', refresh_token: 'refreshToken' },
        },
      );
      const accessTokenResponse = new Observable<AxiosResponse>((observer) => {
        observer.next(response);
      });

      mockHttpService.post.mockImplementation(() => accessTokenResponse);

      const result = await idpService.getAccessTokenFromIdP(
        'code',
        'redirectUri',
      );
      expect(result.access_token).toEqual('accessToken');
      expect(result.refresh_token).toEqual('refreshToken');
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
    it('should refresh token', async () => {});

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
    it('should return user info', async () => {});

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
    it('should revoke token', async () => {});

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
