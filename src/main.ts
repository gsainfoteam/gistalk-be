import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // set CORS config
  const whitelist = [
    /https:\/\/.*gistalk.gistory.me/,
    /https:\/\/.*gistalk-frontend.pages.dev/,
  ];
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.some((regex) => regex.test(origin))) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  // set swagger config
  const config = new DocumentBuilder()
    .setTitle('Gistalk API')
    .setDescription('Gistalk API')
    .setVersion('1.0')
    .addTag('Gistalk')
    .addOAuth2(
      {
        type: 'oauth2',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'token',
        flows: {
          authorizationCode: {
            authorizationUrl: configService.getOrThrow('SWAGGER_AUTH_URL'),
            tokenUrl: configService.getOrThrow('SWAGGER_TOKEN_URL'),
            scopes: {
              openid: 'openid',
              email: 'email',
              profile: ' profile',
            },
          },
        },
      },
      'oauth2',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: `${configService.getOrThrow('API_URL')}/api/oauth2-redirect.html`,
    },
  });
  // start server
  await app.listen(3000);
}
bootstrap();
