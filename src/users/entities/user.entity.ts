import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User login',
    example: 'john_doe',
  })
  login: string;

  @ApiProperty({
    description: 'User password (hidden in responses)',
    example: 'encryptedPassword',
    writeOnly: true,
  })
  password: string;

  @ApiProperty({
    description: 'User version (increments on each update)',
    example: 1,
    minimum: 1,
  })
  version: number;

  @ApiProperty({
    description: 'User creation timestamp',
    example: 1719501234567,
  })
  createdAt: bigint;

  @ApiProperty({
    description: 'User last update timestamp',
    example: 1719501234567,
  })
  updatedAt: bigint;

  @ApiProperty({
    description: 'Refresh token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    writeOnly: true,
  })
  refreshToken: string | null;
}

export class UserWithoutPassword {
  @ApiProperty({
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User login',
    example: 'john_doe',
  })
  login: string;

  @ApiProperty({
    description: 'User version (increments on each update)',
    example: 1,
    minimum: 1,
  })
  version: number;

  @ApiProperty({
    description: 'User creation timestamp',
    example: 1719501234567,
  })
  createdAt: number;

  @ApiProperty({
    description: 'User last update timestamp',
    example: 1719501234567,
  })
  updatedAt: number;

  @ApiProperty({
    description: 'Refresh token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    writeOnly: true,
  })
  refreshToken: string | null;
}
