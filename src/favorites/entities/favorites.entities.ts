import { ApiProperty } from '@nestjs/swagger';

export class Favorites {
  @ApiProperty({
    description: 'Array of favorite artist IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  artists: string[];

  @ApiProperty({
    description: 'Array of favorite album IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  albums: string[];

  @ApiProperty({
    description: 'Array of favorite track IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  tracks: string[];
}
