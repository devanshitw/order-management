import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './response.util';
import { CustomLogger } from '../logger/logger.service';

@Injectable()
export class ResponseInterceptor<T = any>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly logger: CustomLogger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const res = httpContext.getResponse();

    const { method, originalUrl } = req;
    const start = Date.now();

    return next.handle().pipe(
      map((data) => {
        const status_code = res.statusCode;

        let response: ApiResponse<T>;

        if (data && typeof data === 'object' && 'success' in data) {
          response = { ...data, status_code } as ApiResponse<T>;
        } else {
          response = {
            success: true,
            status_code,
            data: data ?? null,
          };
        }

        const duration = Date.now() - start;
        const logMessage = `${method} ${originalUrl} | ${status_code} | ${duration}ms`;

        if (status_code >= 500) {
          this.logger.error(logMessage);
        } else if (status_code >= 400) {
          this.logger.warn(logMessage);
        } else {
          this.logger.log(logMessage);
        }

        return response;
      }),
    );
  }
}
