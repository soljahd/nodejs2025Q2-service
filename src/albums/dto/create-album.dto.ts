import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({ description: 'Album name', example: 'Thriller' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Release year', example: 1982 })
  @IsNumber()
  year: number;

  @ApiPropertyOptional({
    description: 'Artist ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  artistId?: string | null;
}
