import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: Logger;
  private readonly serviceName = 'FoodDelivery';

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: combine(
        label({ label: this.serviceName }),
        timestamp(),
        logFormat,
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string, error?: unknown) {
    const errorMessage =
      message ?? (error instanceof Error ? error.message : String(error));
    this.logger.error(errorMessage);
  }
}
