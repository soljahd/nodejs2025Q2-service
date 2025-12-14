import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = {
  title: 'Home Library Service',
  description: 'Home music library service',
  version: '1.0.0',
  path: 'doc',
  yamlName: 'api.yaml',
};

export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .build();
}
