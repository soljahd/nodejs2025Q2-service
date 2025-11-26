import { Injectable, Inject } from '@nestjs/common';
import { DataService } from '../shared/data.service';
import { FavoritesResponse } from 'src/favorites/interfaces/favorites-response.interface';

@Injectable()
export class FavoritesService {
  constructor(@Inject(DataService) private readonly dataService: DataService) {}

  findAll(): FavoritesResponse {
    const artists = this.dataService.favorites.artists
      .map((id) => this.dataService.artists.find((artist) => artist.id === id))
      .filter((artist) => artist !== undefined);

    const albums = this.dataService.favorites.albums
      .map((id) => this.dataService.albums.find((album) => album.id === id))
      .filter((album) => album !== undefined);

    const tracks = this.dataService.favorites.tracks
      .map((id) => this.dataService.tracks.find((track) => track.id === id))
      .filter((track) => track !== undefined);

    return { artists, albums, tracks };
  }

  addTrack(id: string): boolean {
    const trackExists = this.dataService.tracks.some(
      (track) => track.id === id,
    );
    if (!trackExists) {
      return false;
    }

    if (!this.dataService.favorites.tracks.includes(id)) {
      this.dataService.favorites.tracks.push(id);
    }
    return true;
  }

  removeTrack(id: string): boolean {
    const index = this.dataService.favorites.tracks.indexOf(id);
    if (index > -1) {
      this.dataService.favorites.tracks.splice(index, 1);
      return true;
    }
    return false;
  }

  addAlbum(id: string): boolean {
    const albumExists = this.dataService.albums.some(
      (album) => album.id === id,
    );
    if (!albumExists) {
      return false;
    }

    if (!this.dataService.favorites.albums.includes(id)) {
      this.dataService.favorites.albums.push(id);
    }
    return true;
  }

  removeAlbum(id: string): boolean {
    const index = this.dataService.favorites.albums.indexOf(id);
    if (index > -1) {
      this.dataService.favorites.albums.splice(index, 1);
      return true;
    }
    return false;
  }

  addArtist(id: string): boolean {
    const artistExists = this.dataService.artists.some(
      (artist) => artist.id === id,
    );
    if (!artistExists) {
      return false;
    }

    if (!this.dataService.favorites.artists.includes(id)) {
      this.dataService.favorites.artists.push(id);
    }
    return true;
  }

  removeArtist(id: string): boolean {
    const index = this.dataService.favorites.artists.indexOf(id);
    if (index > -1) {
      this.dataService.favorites.artists.splice(index, 1);
      return true;
    }
    return false;
  }
}
