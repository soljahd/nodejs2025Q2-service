import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Track {
  @ApiProperty({
    description: 'Track UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Track name',
    example: 'Bohemian Rhapsody',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Artist ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  artistId: string | null;

  @ApiPropertyOptional({
    description: 'Album ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  albumId: string | null;

  @ApiProperty({
    description: 'Track duration in seconds',
    example: 354,
  })
  duration: number;
}
