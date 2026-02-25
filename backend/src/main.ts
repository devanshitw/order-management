import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { CustomLogger } from './common/logger';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const DEFAULT_PORT = 3000;
const API_PREFIX = 'api/v1';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix(API_PREFIX);

    // ✅ CORS Configuration (No CorsOptions import needed)
    app.enableCors({
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ) => {
        const allowedOrigins = [
          process.env.FRONTEND_URL,
          'http://localhost:5173',
        ].filter(Boolean);

        // Allow server-to-server or Postman (no origin)
        if (!origin) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      },
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        exceptionFactory: (errors: ValidationError[]) => {
          const formattedErrors = errors.map((err) => ({
            field: err.property,
            constraints: err.constraints,
          }));
          return new BadRequestException({
            status_code: 400,
            message: 'Bad Request',
            errors: formattedErrors,
          });
        },
      }),
    );

    const customLogger = app.get(CustomLogger);

    app.useGlobalFilters(
      new ValidationExceptionFilter(customLogger),
      new HttpExceptionFilter(customLogger),
    );

    const port = Number(process.env.PORT) || DEFAULT_PORT;
    await app.listen(port);

    logger.log(
      `Application is running on: http://localhost:${port}/${API_PREFIX}`,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    Logger.error(
      `Failed to start application: ${errorMessage}`,
      error instanceof Error ? error.stack : undefined,
      'Bootstrap',
    );

    process.exit(1);
  }
}

bootstrap();