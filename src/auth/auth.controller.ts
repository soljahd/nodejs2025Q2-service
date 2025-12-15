import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Tokens } from './interfaces/tokens.interface';
import { UserWithoutPassword } from '../users/entities/user.entity';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserWithoutPassword,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Login already exists' })
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshDto })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Refresh token is required' })
  @ApiResponse({ status: 403, description: 'Invalid or expired refresh token' })
  async refresh(@Body() dto: RefreshDto, @Req() req: Request): Promise<Tokens> {
    if (!req.body) {
      throw new UnauthorizedException(
        'Refresh token is required in request body',
      );
    }

    if (!dto.refreshToken) {
      throw new BadRequestException(
        'Refresh token is required in request body',
      );
    }

    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Logout user' })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto.userId);
  }
}
