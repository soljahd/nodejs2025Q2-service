import { JwtPayload } from '../interfaces/tokens.interface';

export function isJwtPayload(data: unknown): data is JwtPayload {
  return (
    typeof data === 'object' &&
    data !== null &&
    'userId' in data &&
    'login' in data
  );
}
