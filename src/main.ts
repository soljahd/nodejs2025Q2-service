import { NestFactory } from '@nestjs/core';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { loadEnvFile } from 'node:process';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { stringify } from 'yaml';
import { AppModule } from './app.module';

loadEnvFile();

const PORT = Number(process.env['PORT']);

async function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  console.log(
    `Swagger documentation available at: http://localhost:${String(PORT)}/doc`,
  );
  try {
    const yamlString = stringify(document);
    await writeFile(join(__dirname, '../doc/api.yaml'), yamlString);
  } catch (error) {
    console.error('Error updating /doc/api.yaml:', error);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${String(PORT)}`);
}
void bootstrap();
