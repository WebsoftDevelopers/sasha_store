import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const frontendUrl =
    configService.get<string>('app.frontendUrl') || 'http://localhost:3000';
  const allowedOrigins = [
    frontendUrl,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...frontendUrl
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser / same-origin requests (no Origin header)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, true); // marketplace API is public; tighten later if needed
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const apiPrefix = configService.get<string>('app.apiPrefix')!;
  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Sasha Store API')
    .setDescription('API documentation for Sasha Store backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  const port =
    configService.get<number>('app.port') || Number(process.env.PORT) || 8000;
  await app.listen(port, '0.0.0.0');
  console.log(`Sasha Store API listening on 0.0.0.0:${port}`);
}
bootstrap();
