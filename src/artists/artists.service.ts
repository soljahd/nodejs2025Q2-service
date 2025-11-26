import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { DataService } from '../shared/data.service';

@Injectable()
export class ArtistsService {
  constructor(@Inject(DataService) private readonly dataService: DataService) {}

  findAll(): Artist[] {
    return this.dataService.artists;
  }

  findOne(id: string): Artist {
    const artist = this.dataService.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: this.generateUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.dataService.artists.push(artist);
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artistIndex = this.dataService.artists.findIndex(
      (artist) => artist.id === id,
    );

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    const updatedArtist = Object.assign(
      this.dataService.artists[artistIndex],
      updateArtistDto,
    );

    this.dataService.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string): void {
    const artistIndex = this.dataService.artists.findIndex(
      (artist) => artist.id === id,
    );

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.removeArtistIdFromTracks(id);
    this.removeArtistIdFromAlbums(id);
    this.removeArtistFromFavorites(id);

    this.dataService.artists.splice(artistIndex, 1);
  }

  private removeArtistIdFromTracks(artistId: string): void {
    this.dataService.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  private removeArtistIdFromAlbums(artistId: string): void {
    this.dataService.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }

  private removeArtistFromFavorites(artistId: string): void {
    const favIndex = this.dataService.favorites.artists.indexOf(artistId);
    if (favIndex > -1) {
      this.dataService.favorites.artists.splice(favIndex, 1);
    }
  }

  private generateUUID(): string {
    return crypto.randomUUID();
  }
}
