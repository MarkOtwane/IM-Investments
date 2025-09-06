/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    // Configure body parser options
    bodyParser: true,
  });

  // Get the underlying Express instance to configure payload size
  const expressInstance = app.getHttpAdapter().getInstance();
  // Increase payload size limit for JSON and URL-encoded data
  expressInstance.use(require('body-parser').json({ limit: '10mb' }));
  expressInstance.use(
    require('body-parser').urlencoded({ limit: '10mb', extended: true }),
  );

  // Enable validation globally with transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:3000',
      'https://im-investments.vercel.app',
      'https://im-investments.onrender.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });

  await app.listen(3000);
  console.log('🚀 Backend server is running');
}
bootstrap();
