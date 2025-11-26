import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAlbumDto {
  @ApiPropertyOptional({ description: 'Album name', example: 'Thriller' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Release year', example: 1982 })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({
    description: 'Artist ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  artistId?: string | null;
}
