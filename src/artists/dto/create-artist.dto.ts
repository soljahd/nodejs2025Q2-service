import { IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({
    description: 'Artist name',
    example: 'Michael Jackson',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Whether the artist has won a Grammy award',
    example: true,
  })
  @IsBoolean()
  grammy: boolean;
}
