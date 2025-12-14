import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingService } from './logging/logging.service';
import { setupExceptionHandlers } from './setup/exception-handlers.setup';
import { setupApplication } from './setup/app.setup';
import { setupSwagger } from './setup/swagger.setup';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = app.get(LoggingService);

  setupExceptionHandlers(loggingService);
  setupApplication(app);

  await setupSwagger(app, appConfig.port, loggingService);

  await app.listen(appConfig.port);

  loggingService.log(
    `Application is running on: http://localhost:${String(appConfig.port)}`,
    'Bootstrap',
  );
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to bootstrap application:', error);
  process.exit(1);
});
