import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Tokens, JwtPayload } from './interfaces/tokens.interface';
import { User } from '../users/entities/user.entity';
import { isJwtPayload } from './utils/isJwtPayload';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private readonly accessSecret: string = process.env.JWT_SECRET_KEY ?? '';
  private readonly refreshSecret: string =
    process.env.JWT_SECRET_REFRESH_KEY ?? '';
  private readonly accessExpiresIn: string =
    process.env.TOKEN_EXPIRE_TIME ?? '1h';
  private readonly refreshExpiresIn: string =
    process.env.TOKEN_REFRESH_EXPIRE_TIME ?? '24h';

  async signup(signupDto: SignupDto) {
    return this.usersService.create({
      login: signupDto.login,
      password: signupDto.password,
    });
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findByLogin(loginDto.login);

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) {
      throw new ForbiddenException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const payload = this.verifyRefreshToken(refreshToken);

    const user = await this.usersService.findByIdFull(payload.userId);
    if (!user) {
      throw new ForbiddenException('Invalid refresh token');
    }

    if (!user.refreshToken || user.refreshToken !== refreshToken) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const newTokens = this.generateTokens(user);

    await this.usersService.setRefreshToken(user.id, newTokens.refreshToken);

    return newTokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.setRefreshToken(userId, null);
  }

  private verifyRefreshToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.refreshSecret);

      if (!isJwtPayload(decoded)) {
        throw new ForbiddenException('Invalid refresh payload');
      }

      return decoded;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new ForbiddenException('Refresh token expired');
      }
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  private generateTokens(user: User): Tokens {
    if (!this.accessSecret || !this.refreshSecret) {
      throw new InternalServerErrorException(
        'JWT secrets are not configured in env',
      );
    }

    const payload: JwtPayload = {
      userId: user.id,
      login: user.login,
    };

    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiresIn,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }
}
