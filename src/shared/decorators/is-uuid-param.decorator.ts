import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Request } from 'express';

export const IsUUIDParam = createParamDecorator(
  (data: string, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<Request>();
    const id = request.params[data];

    if (!validate(id)) {
      throw new BadRequestException('ID is invalid (not uuid)');
    }

    return id;
  },
);
