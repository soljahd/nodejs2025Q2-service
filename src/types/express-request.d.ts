import { JwtPayload } from '../auth/interfaces/tokens.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
