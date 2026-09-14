import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import {
  json,
  urlencoded,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { AppModule } from './app.module';

function splitOrigins(value = '') {
  return value
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
}

function rateLimit(windowMs: number, max: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path.endsWith('/health')) {
      next();
      return;
    }

    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const current = hits.get(key);

    if (!current || current.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    current.count += 1;
    if (current.count > max) {
      res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
      res.status(429).json({ statusCode: 429, message: 'Too many requests' });
      return;
    }

    next();
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('app.nodeEnv') || 'development';
  const isProduction = nodeEnv === 'production';

  const server = app.getHttpAdapter().getInstance();
  server.disable('x-powered-by');
  if (configService.get<boolean>('app.trustProxy')) {
    server.set('trust proxy', 1);
  }
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  app.use(securityHeaders);
  app.use(
    rateLimit(
      configService.get<number>('app.rateLimitWindowMs') || 60_000,
      configService.get<number>('app.rateLimitMax') || 180,
    ),
  );

  const frontendUrl =
    configService.get<string>('app.frontendUrl') || 'http://localhost:3000';
  const allowedOrigins = new Set([
    ...splitOrigins(frontendUrl),
    ...splitOrigins(configService.get<string>('app.corsAllowedOrigins')),
    ...(isProduction ? [] : ['http://localhost:3000', 'http://127.0.0.1:3000']),
  ]);

  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin?.replace(/\/$/, '');
    if (origin && !allowedOrigins.has(origin)) {
      res.status(403).json({ statusCode: 403, message: 'Origin not allowed' });
      return;
    }
    next();
  });

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser / same-origin requests (no Origin header)
      if (!origin || allowedOrigins.has(origin.replace(/\/$/, ''))) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'), false);
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
  if (!isProduction || configService.get<boolean>('app.docsEnabled')) {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
  }

  const port =
    configService.get<number>('app.port') || Number(process.env.PORT) || 8000;
  app.enableShutdownHooks();
  await app.listen(port, '0.0.0.0');
  console.log(`Sasha Store API listening on 0.0.0.0:${port}`);
}
bootstrap();
