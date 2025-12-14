import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import { join as pathJoin } from 'path';
import { EOL as osEOL } from 'os';
import {
  LogMetadata,
  LEVEL_PRIORITY,
  LogMessage,
  StructuredLog,
  RequestLogData,
  ResponseLogData,
  ErrorLogData,
} from './interfaces/logging.interface';
import { maskSensitive, toMetadata } from './utils/logging.utils';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logDir: string;
  private readonly maxFileSize: number;
  private readonly configuredPriority: number;

  constructor() {
    this.logDir = pathJoin(process.cwd(), 'logs');

    const sizeKb = Number(process.env.MAX_LOG_FILE_SIZE_KB ?? '1024');
    this.maxFileSize = (isNaN(sizeKb) ? 1024 : sizeKb) * 1024;

    this.ensureLogDirectory();

    const envLevel = process.env.LOG_LEVEL || 'log';
    const validLevel =
      LEVEL_PRIORITY[envLevel] !== undefined ? envLevel : 'log';

    this.configuredPriority = LEVEL_PRIORITY[validLevel as LogLevel];

    this.log('LoggingService initialized', 'LoggingService', {
      configuredLevel: validLevel,
      configuredPriority: this.configuredPriority,
      maxFileSize: this.maxFileSize,
      logDirectory: this.logDir,
    });
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] <= this.configuredPriority;
  }

  private getLogFile(level: LogLevel): string {
    const date = new Date().toISOString().split('T')[0];
    return pathJoin(this.logDir, `${level}-${date}.log`);
  }

  private async rotateIfNeeded(path: string): Promise<void> {
    try {
      const exists = await fsPromises
        .stat(path)
        .then(() => true)
        .catch(() => false);

      if (!exists) return;

      const stats = await fsPromises.stat(path);
      if (stats.size < this.maxFileSize) return;

      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const rotated = path.replace('.log', `-${ts}.log`);

      await fsPromises.rename(path, rotated);
    } catch (err) {
      console.error('Failed to rotate log file:', err);
    }
  }

  private extractMessage(message: LogMessage): string {
    if (typeof message === 'string') return message;
    if (message instanceof Error) return message.message;

    return JSON.stringify(maskSensitive(message));
  }

  private buildLog(
    level: LogLevel,
    message: LogMessage,
    context?: string,
    metadata?: LogMetadata,
  ): string {
    const log: StructuredLog = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message: this.extractMessage(message),
      metadata: metadata ? maskSensitive(metadata) : undefined,
    };

    return JSON.stringify(log) + osEOL;
  }

  private async appendToFile(
    level: LogLevel,
    message: LogMessage,
    context?: string,
    metadata?: LogMetadata,
  ): Promise<void> {
    const file = this.getLogFile(level);
    const entry = this.buildLog(level, message, context, metadata);

    await this.rotateIfNeeded(file);

    await fsPromises
      .appendFile(file, entry, { encoding: 'utf8' })
      .catch((err: unknown) => {
        console.error('Failed to write log:', err);
      });
  }

  private printToConsole(
    level: LogLevel,
    message: LogMessage,
    context?: string,
    metadata?: LogMetadata,
  ): void {
    const ts = new Date().toISOString();
    const ctx = context ? ` [${context}]` : '';
    const msg = this.extractMessage(message);
    const meta = metadata ? ` ${JSON.stringify(maskSensitive(metadata))}` : '';

    const final = `[${ts}] [${level.toUpperCase()}]${ctx} ${msg}${meta}`;

    switch (level) {
      case 'fatal':
      case 'error':
        console.error(final);
        break;
      case 'warn':
        console.warn(final);
        break;
      case 'debug':
        console.debug(final);
        break;
      default:
        console.log(final);
    }
  }

  private write(
    level: LogLevel,
    message: LogMessage,
    context?: string,
    metadata?: LogMetadata,
  ): void {
    if (!this.shouldLog(level)) return;

    this.printToConsole(level, message, context, metadata);
    void this.appendToFile(level, message, context, metadata);
  }

  fatal(message: LogMessage, context?: string, metadata?: LogMetadata): void {
    this.write('fatal', message, context, metadata);
  }

  error(
    message: LogMessage,
    trace?: string,
    context?: string,
    metadata?: LogMetadata,
  ): void {
    this.write('error', message, context, {
      ...metadata,
      ...(trace && { stack: trace }),
    });
  }

  warn(message: LogMessage, context?: string, metadata?: LogMetadata): void {
    this.write('warn', message, context, metadata);
  }

  log(message: LogMessage, context?: string, metadata?: LogMetadata): void {
    this.write('log', message, context, metadata);
  }

  debug(message: LogMessage, context?: string, metadata?: LogMetadata): void {
    this.write('debug', message, context, metadata);
  }

  verbose(message: LogMessage, context?: string, metadata?: LogMetadata): void {
    this.write('verbose', message, context, metadata);
  }

  logRequest(data: RequestLogData, context?: string): void {
    const metadata = toMetadata(maskSensitive(data));
    this.log('Incoming request', context, metadata);
  }

  logResponse(data: ResponseLogData, context?: string): void {
    const level: LogLevel =
      data.statusCode >= 500
        ? 'error'
        : data.statusCode >= 400
          ? 'warn'
          : 'log';

    const metadata = toMetadata({
      method: data.method,
      url: data.url,
      statusCode: data.statusCode,
      duration: data.duration,
    });

    this.write(level, 'Request completed', context, metadata);
  }

  logError(data: ErrorLogData, context?: string): void {
    const metadata = toMetadata(maskSensitive(data));
    this.error(data.message, data.stack, context, metadata);
  }
}
