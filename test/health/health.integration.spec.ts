import { INestApplication, ServiceUnavailableException } from '@nestjs/common';
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
import * as request from 'supertest';

describe('HealthController (integration)', () => {
  let app: INestApplication;
  let healthController: HealthController;
  let mockHealthCheckService: DeepMockProxy<HealthCheckService>;
  let mockPrismaHealthIndicator: DeepMockProxy<PrismaHealthIndicator>;
  let mockPrisma: DeepMockProxy<PrismaClient>;
  let mockDiskHealthIndicator: DeepMockProxy<DiskHealthIndicator>;
  let mockConfigService: DeepMockProxy<ConfigService>;
  let mockMemoryHealthIndicator: DeepMockProxy<MemoryHealthIndicator>;
  let mockHttpHealthIndicator: HttpHealthIndicator;

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

    app = moduleRef.createNestApplication();
    healthController = moduleRef.get<HealthController>(HealthController);
    mockHealthCheckService = moduleRef.get(HealthCheckService);
    mockPrismaHealthIndicator = moduleRef.get(PrismaHealthIndicator);
    mockPrisma = moduleRef.get(PrismaService);
    mockDiskHealthIndicator = moduleRef.get(DiskHealthIndicator);
    mockConfigService = moduleRef.get(ConfigService);
    mockMemoryHealthIndicator = moduleRef.get(MemoryHealthIndicator);
    mockHttpHealthIndicator = moduleRef.get(HttpHealthIndicator);

    await app.init();
  });

  it('to be defined', async () => {
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
    it('should return health check', async () => {
      const expectedResult = {
        status: 'ok',
        info: {
          gistalk: {
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
        details: {},
      };

      mockHealthCheckService.check.mockResolvedValue(expectedResult as any);

      const result = await request(app.getHttpServer()).get('/health').send();

      expect(result.status).toBe(200);
      expect(result.body.status).toBe('ok');
      expect(result.body.info.gistalk.status).toBe('ok');
      expect(result.body.info.database.status).toBe('ok');
      expect(result.body.info.storage.status).toBe('ok');
      expect(result.body.info.memory_rss.status).toBe('ok');
    });

    it('should 503 error when API_URL is unavailable', async () => {
      mockHealthCheckService.check.mockRejectedValue(
        new ServiceUnavailableException({
          status: 'error',
          info: {},
          error: {
            gistalk: {
              status: 'down',
              message: 'message',
            },
          },
          details: {},
        }),
      );

      const result = await request(app.getHttpServer()).get('/health').send();

      expect(result.status).toBe(503);
      expect(result.body.status).toBe('error');
      expect(result.body.error.gistalk.status).toBe('down');
    });

    it('should 503 error when database is unavailable', async () => {
      mockHealthCheckService.check.mockRejectedValue(
        new ServiceUnavailableException({
          status: 'error',
          info: {},
          error: {
            database: {
              status: 'down',
              message: 'message',
            },
          },
          details: {},
        }),
      );

      const result = await request(app.getHttpServer()).get('/health').send();

      expect(result.status).toBe(503);
      expect(result.body.status).toBe('error');
      expect(result.body.error.database.status).toBe('down');
    });

    it('should 503 error when storage is unavailable', async () => {
      mockHealthCheckService.check.mockRejectedValue(
        new ServiceUnavailableException({
          status: 'error',
          info: {},
          error: {
            storage: {
              status: 'down',
              message: 'message',
            },
          },
          details: {},
        }),
      );

      const result = await request(app.getHttpServer()).get('/health').send();

      expect(result.status).toBe(503);
      expect(result.body.status).toBe('error');
      expect(result.body.error.storage.status).toBe('down');
    });

    it('should 503 error when memory_rss is unavailable', async () => {
      mockHealthCheckService.check.mockRejectedValue(
        new ServiceUnavailableException({
          status: 'error',
          info: {},
          error: {
            memory_rss: {
              status: 'down',
              message: 'message',
            },
          },
          details: {},
        }),
      );

      const result = await request(app.getHttpServer()).get('/health').send();

      expect(result.status).toBe(503);
      expect(result.body.status).toBe('error');
      expect(result.body.error.memory_rss.status).toBe('down');
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
