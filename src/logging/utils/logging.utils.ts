import { LogMetadata, SENSITIVE_FIELDS } from '../interfaces/logging.interface';

function safeDeepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const clonedArray = obj.map((item) => safeDeepClone(item) as unknown[]);
    return clonedArray as T;
  }

  const clonedObj = {} as { [K in keyof T]: T[K] };

  for (const key of Object.keys(obj) as Array<keyof T>) {
    clonedObj[key] = safeDeepClone(obj[key]);
  }

  return clonedObj;
}

export function toMetadata(obj: object): LogMetadata {
  return safeDeepClone(obj) as Record<string, unknown>;
}

export function maskSensitive<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;

  const cloned = safeDeepClone(obj);

  const maskRecursively = (obj: unknown): void => {
    if (!obj || typeof obj !== 'object') return;

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
        (obj as Record<string, unknown>)[key] = '***';
      } else if (value && typeof value === 'object') {
        maskRecursively(value);
      }
    }
  };

  maskRecursively(cloned);
  return cloned;
}
