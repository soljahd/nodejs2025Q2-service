import { LoggingService } from '../logging/logging.service';

export function setupExceptionHandlers(loggingService: LoggingService) {
  process.on('uncaughtException', (err: Error) => {
    loggingService.error('Uncaught Exception occurred', err.stack, 'Process', {
      message: err.message,
      error: err.message,
      stack: err.stack,
    });
    process.exit(1);
  });

  process.on(
    'unhandledRejection',
    (reason: unknown, promise: Promise<unknown>) => {
      const reasonMessage =
        reason instanceof Error ? reason.message : String(reason);

      loggingService.error(
        'Unhandled Rejection occurred',
        reason instanceof Error ? reason.stack : undefined,
        'Process',
        {
          reason: reasonMessage,
          promise: `Promise(${promise.constructor.name || 'Unknown'})`,
          reasonType: (reason && reason.constructor.name) || typeof reason,
          timestamp: new Date().toISOString(),
        },
      );
    },
  );
}
