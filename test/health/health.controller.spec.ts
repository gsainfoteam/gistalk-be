import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DiskHealthIndicator,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { HealthController } from 'src/health/health.controller';
import { PrismaService } from 'src/prisma/prisma.service';

describe('HealthController', () => {
  let healthController: HealthController;
  let mockHealthCheckService: DeepMockProxy<HealthCheckService>;
  let mockPrismaHealthIndicator: DeepMockProxy<PrismaHealthIndicator>;
  let mockPrisma: DeepMockProxy<PrismaClient>;
  let mockDiskHealthIndicator: DeepMockProxy<DiskHealthIndicator>;
  let mockConfigService: DeepMockProxy<ConfigService>;
  let mockMemoryHealthIndicator: DeepMockProxy<MemoryHealthIndicator>;
  let mockHttpHealthIndicator: DeepMockProxy<HttpHealthIndicator>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockDeep<HealthCheckService>(),
        },
        {
          provide: PrismaHealthIndicator,
          useValue: mockDeep<PrismaHealthIndicator>(),
        },
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaClient>(),
        },
        {
          provide: DiskHealthIndicator,
          useValue: mockDeep<DiskHealthIndicator>(),
        },
        {
          provide: ConfigService,
          useValue: mockDeep<ConfigService>(),
        },
        {
          provide: MemoryHealthIndicator,
          useValue: mockDeep<MemoryHealthIndicator>(),
        },
        {
          provide: HttpHealthIndicator,
          useValue: mockDeep<HttpHealthIndicator>(),
        },
      ],
    }).compile();

    healthController = moduleRef.get<HealthController>(HealthController);
    mockPrisma = moduleRef.get(PrismaService);
    mockHealthCheckService = moduleRef.get(HealthCheckService);
    mockPrismaHealthIndicator = moduleRef.get(PrismaHealthIndicator);
    mockDiskHealthIndicator = moduleRef.get(DiskHealthIndicator);
    mockConfigService = moduleRef.get(ConfigService);
    mockMemoryHealthIndicator = moduleRef.get(MemoryHealthIndicator);
    mockHttpHealthIndicator = moduleRef.get(HttpHealthIndicator);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
    expect(mockPrisma).toBeDefined();
    expect(mockHealthCheckService).toBeDefined();
    expect(mockPrismaHealthIndicator).toBeDefined();
    expect(mockDiskHealthIndicator).toBeDefined();
    expect(mockConfigService).toBeDefined();
    expect(mockMemoryHealthIndicator).toBeDefined();
    expect(mockHttpHealthIndicator).toBeDefined();
  });

  describe('check', () => {
    it('should check health', async () => {
      const expectedResult = {
        status: 'ok',
        info: {
          idp: {
            status: 'ok',
          },
          database: {
            status: 'ok',
          },
          storage: {
            status: 'ok',
          },
          memory_rss: {
            status: 'ok',
          },
        },
        error: {},
        details: {
          idp: {
            status: 'ok',
          },
          database: {
            status: 'ok',
          },
          storage: {
            status: 'ok',
          },
          memory_rss: {
            status: 'ok',
          },
        },
      };

      mockHealthCheckService.check.mockResolvedValue(expectedResult as any);

      const result: any = await healthController.check();

      expect(result.status).toBe('ok');
      expect(result.info.idp.status).toBe('ok');
      expect(result.info.database.status).toBe('ok');
      expect(result.info.storage.status).toBe('ok');
      expect(result.info.memory_rss.status).toBe('ok');
      expect(result.error).toEqual({});
    });

    it('should throw ServiceUnavailableException when mockHealthCheckService.check contains error', async () => {
      mockHealthCheckService.check.mockRejectedValue(
        new ServiceUnavailableException(),
      );

      expect(healthController.check()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});
