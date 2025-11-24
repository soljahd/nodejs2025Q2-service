import { NestFactory } from '@nestjs/core';
import { type INestApplication } from '@nestjs/common';
import { SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';
import { loadEnvFile } from 'node:process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { AppModule } from './app.module';

loadEnvFile();

const PORT = Number(process.env['PORT']);

async function setupSwagger(app: INestApplication) {
  try {
    const yamlPath = join(__dirname, '../doc/api.yaml');
    const yamlFile = await readFile(yamlPath, 'utf8');
    const document = parse(yamlFile) as OpenAPIObject;

    SwaggerModule.setup('doc', app, document);
    console.log(
      `Swagger documentation available at: http://localhost:${String(PORT)}/doc`,
    );
    return true;
  } catch (error) {
    console.error('Error setting up Swagger:', error);
    return false;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupSwagger(app);

  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${String(PORT)}`);
}
void bootstrap();
