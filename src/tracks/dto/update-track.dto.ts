import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrackDto {
  @ApiPropertyOptional({
    description: 'Track name',
    example: 'Bohemian Rhapsody',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Artist ID (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  artistId?: string | null;

  @ApiPropertyOptional({
    description: 'Album ID (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  albumId?: string | null;

  @ApiPropertyOptional({
    description: 'Track duration in seconds',
    example: 354,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;
}
