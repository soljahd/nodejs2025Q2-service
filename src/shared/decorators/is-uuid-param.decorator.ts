import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';

export function isUuid(id: string): boolean {
  return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i.test(
    id,
  );
}

export const IsUUIDParam = createParamDecorator(
  (data: string, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<Request>();
    const id = request.params[data];

    if (!isUuid(id)) {
      throw new BadRequestException('ID is invalid (not uuid)');
    }

    return id;
  },
);
