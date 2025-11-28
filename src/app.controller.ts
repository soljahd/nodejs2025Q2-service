import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Check if the API service is running and healthy',
  })
  @ApiResponse({
    status: 200,
    description: 'API service is healthy and running',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Music Service API is running!',
        },
        timestamp: {
          type: 'string',
          example: '2024-06-27T10:30:00.000Z',
        },
        status: {
          type: 'string',
          example: 'OK',
        },
        version: {
          type: 'string',
          example: '1.0.0',
        },
      },
    },
  })
  getHello(): {
    message: string;
    timestamp: string;
    status: string;
    version: string;
  } {
    return this.appService.getHello();
  }
}
