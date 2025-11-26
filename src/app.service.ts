import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): {
    message: string;
    timestamp: string;
    status: string;
    version: string;
  } {
    return {
      message: 'Music Service API is running!',
      timestamp: new Date().toISOString(),
      status: 'OK',
      version: '1.0.0',
    };
  }
}
