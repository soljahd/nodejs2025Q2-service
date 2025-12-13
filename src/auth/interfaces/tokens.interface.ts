export interface JwtPayload {
  userId: string;
  login: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
