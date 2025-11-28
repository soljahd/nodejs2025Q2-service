import { Artist } from '../../artists/entities/artist.entity';
import { Album } from '../../albums/entities/album.entity';
import { Track } from '../../tracks/entities/track.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FavoritesResponse {
  @ApiProperty({
    description: 'List of favorite artists',
    type: [Artist],
  })
  artists: Artist[];

  @ApiProperty({
    description: 'List of favorite albums',
    type: [Album],
  })
  albums: Album[];

  @ApiProperty({
    description: 'List of favorite tracks',
    type: [Track],
  })
  tracks: Track[];
}
