import { LogLevel } from '@nestjs/common';

export type LogMessage = string | Record<string, unknown> | Error;

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  context?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface LogMetadata {
  [key: string]: unknown;
}

export interface RequestLogData {
  method: string;
  url: string;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: unknown;
}

export interface ResponseLogData {
  method: string;
  url: string;
  statusCode: number;
  duration: number;
}

export interface ErrorLogData {
  message: string;
  stack?: string;
  url?: string;
  method?: string;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: unknown;
  statusCode?: number;
}

export const LEVEL_PRIORITY: Record<LogLevel, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  log: 3,
  debug: 4,
  verbose: 5,
};

export const SENSITIVE_FIELDS = [
  'password',
  'pass',
  'pwd',
  'token',
  'access_token',
  'refresh_token',
  'authorization',
  'creditcard',
  'cardnumber',
];
