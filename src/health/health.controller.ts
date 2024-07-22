import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
    private readonly disk: DiskHealthIndicator,
    private readonly configService: ConfigService,
    private readonly memory: MemoryHealthIndicator,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({
    summary: '헬스 체크 api',
    description: 'http, prisma, disk, memory rss 체크',
  })
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'gistalk',
          this.configService.getOrThrow('API_URL'),
        ),

      () =>
        this.prisma.pingCheck('database', this.prismaService, { timeout: 300 }),

      () =>
        this.disk.checkStorage('storage', {
          path: this.configService.getOrThrow('DISK_ROOT_PATH'),
          threshold:
            this.configService.getOrThrow('THRESHOLD_GB') * 1024 * 1024 * 1024,
        }),

      () =>
        this.memory.checkRSS(
          'memory_rss',
          this.configService.getOrThrow('MEMORY_THRESHOLD_MB') * 1024 * 1024,
        ),
    ]);
  }
}
