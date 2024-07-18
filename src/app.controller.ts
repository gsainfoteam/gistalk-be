import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  private readonly apiVersion =
    this.configService.getOrThrow<string>('API_VERSION');
  private readonly publishedAt = new Date().toISOString();
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getHello() {
    return {
      name: 'Gistalk',
      version: this.apiVersion,
      publishedAt: this.publishedAt,
    };
  }
}
