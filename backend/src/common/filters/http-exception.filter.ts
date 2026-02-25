import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { errorMessage } from '../utils/error.message';
import { CustomLogger } from '../logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let body: any = {
      message: errorMessage.INTERNAL_SERVER_ERROR,
      status_code: status,
    };

    if (typeof exceptionResponse === 'string') {
      body.message = exceptionResponse;
    }

    if (typeof exceptionResponse === 'object') {
      const { statusCode, ...rest } = exceptionResponse as any;
      body = { ...rest, status_code: status };
    }

    this.logger.error(
      `[HTTP_EXCEPTION] ${request.method} ${request.originalUrl} | ${status} | ${body.message}`,
    );

    response.status(status).json(body);
  }
}
