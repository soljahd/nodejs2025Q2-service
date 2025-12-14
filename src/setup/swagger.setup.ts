import { INestApplication } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { stringify } from 'yaml';
import { LoggingService } from '../logging/logging.service';
import { createSwaggerConfig, swaggerConfig } from '../config/swagger.config';

export async function setupSwagger(
  app: INestApplication,
  port: number,
  loggingService: LoggingService,
): Promise<void> {
  const config = createSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerConfig.path, app, document);

  loggingService.log(
    `Swagger documentation available at: http://localhost:${String(port)}/${swaggerConfig.path}`,
    'SwaggerSetup',
  );

  await saveSwaggerYaml(document, loggingService);
}

async function saveSwaggerYaml(
  document: OpenAPIObject,
  loggingService: LoggingService,
): Promise<void> {
  try {
    const yamlString = stringify(document);
    await writeFile(
      join(process.cwd(), swaggerConfig.path, swaggerConfig.yamlName),
      yamlString,
    );
  } catch (err) {
    loggingService.error(
      'Error updating Swagger YAML file',
      err instanceof Error ? err.stack : undefined,
      'SwaggerSetup',
    );
  }
}
