import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';
import { ErrorLogData } from '../logging/interfaces/logging.interface';
import { ExceptionResponse } from './interfaces/exception.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as
        | string
        | ExceptionResponse;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const responseMessage = exceptionResponse.message;
        if (typeof responseMessage === 'string') {
          message = responseMessage;
        } else if (Array.isArray(responseMessage)) {
          message = responseMessage.join(', ');
        } else {
          message = exception.message;
        }
      }
      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    const errorData: ErrorLogData = {
      message: `Error occurred: ${message}`,
      stack,
      url: request.url,
      method: request.method,
      params: request.params as Record<string, string>,
      query: request.query as Record<string, string | string[]>,
      body: request.body as unknown,
      statusCode: status,
    };

    this.loggingService.logError(errorData, 'ExceptionFilter');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
