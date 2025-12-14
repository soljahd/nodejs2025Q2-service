import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { appConfig } from '../config/app.config';

export function setupApplication(app: INestApplication): void {
  const allExceptionsFilter = app.get(AllExceptionsFilter);
  const loggingInterceptor = app.get(LoggingInterceptor);

  app.useGlobalFilters(allExceptionsFilter);
  app.useGlobalInterceptors(loggingInterceptor);

  app.useGlobalPipes(new ValidationPipe(appConfig.validationPipe));
}
