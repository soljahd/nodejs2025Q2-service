import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArtistDto {
  @ApiPropertyOptional({
    description: 'Artist name',
    example: 'Michael Jackson',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Whether the artist has won a Grammy award',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  grammy?: boolean;
}
