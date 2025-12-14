import { Module, Global } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

@Global()
@Module({
  providers: [LoggingService, AllExceptionsFilter, LoggingInterceptor],
  exports: [LoggingService, AllExceptionsFilter, LoggingInterceptor],
})
export class LoggingModule {}
