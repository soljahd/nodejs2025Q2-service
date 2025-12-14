import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';
import {
  RequestLogData,
  ResponseLogData,
  ErrorLogData,
} from '../logging/interfaces/logging.interface';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const method: string = request.method;
    const url: string = request.url;
    const params: Record<string, string> = request.params as Record<
      string,
      string
    >;
    const query: Record<string, string | string[]> = request.query as Record<
      string,
      string | string[]
    >;
    const body: unknown = request.body;

    const startTime = Date.now();

    const requestData: RequestLogData = {
      method,
      url,
      params,
      query,
      body,
    };

    this.loggingService.logRequest(requestData, 'RequestInterceptor');

    response.on('finish', () => {
      const duration = Date.now() - startTime;
      const responseData: ResponseLogData = {
        method,
        url,
        statusCode: response.statusCode,
        duration,
      };
      this.loggingService.logResponse(responseData, 'ResponseInterceptor');
    });

    return next.handle().pipe(
      tap({
        error: (err: unknown) => {
          const status =
            err instanceof HttpException
              ? err.getStatus()
              : response.statusCode || 500;

          const errorMessage = err instanceof Error ? err.message : String(err);

          const errorData: ErrorLogData = {
            message: errorMessage,
            stack: err instanceof Error ? err.stack : undefined,
            url,
            method,
            params,
            query,
            body,
            statusCode: status,
          };

          this.loggingService.logError(errorData, 'ResponseInterceptor');
        },
      }),
    );
  }
}
