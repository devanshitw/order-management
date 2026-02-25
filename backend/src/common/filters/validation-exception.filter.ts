import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { STATUS_MESSAGE } from '../constants/status-code';
import { CustomLogger } from '../logger';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse: any = exception.getResponse();
    const status = exception.getStatus() || HttpStatus.BAD_REQUEST;

    this.logger.warn(
      `Bad Request: ${
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse?.message ?? STATUS_MESSAGE.BAD_REQUEST)
      }`,
    );

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      if (
        Array.isArray(exceptionResponse.message) &&
        exceptionResponse.message.length > 0
      ) {
        const message = exceptionResponse.message.join(', ');
        return response.status(status).json({
          success: false,
          status_code: status,
          message,
        });
      }
    }

    return response.status(status).json({
      success: false,
      status_code: status,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse?.message || STATUS_MESSAGE.BAD_REQUEST,
    });
  }
}
