import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtPayload } from '../interfaces/tokens.interface';
import { Request } from 'express';
import { isJwtPayload } from '../utils/isJwtPayload';

@Injectable()
export class JwtAuthGuard {
  private readonly accessSecret: string = process.env.JWT_SECRET_KEY ?? '';

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    const payload = this.verifyToken(token);
    request.user = payload;

    return true;
  }

  private verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.accessSecret);

      if (!isJwtPayload(decoded)) {
        throw new ForbiddenException('Invalid token payload shape');
      }

      return decoded;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new ForbiddenException('Access token expired');
      }
      throw new ForbiddenException('Invalid access token');
    }
  }
}
