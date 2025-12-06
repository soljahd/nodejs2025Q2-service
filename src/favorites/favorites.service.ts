import { Injectable } from '@nestjs/common';
import { FavoritesResponse } from './interfaces/favorites-response.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  private readonly FAVORITES_ID = '00000000-0000-0000-0000-000000000000';

  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateFavorites() {
    try {
      return await this.prisma.favorites.findUniqueOrThrow({
        where: { id: this.FAVORITES_ID },
      });
    } catch {
      return await this.prisma.favorites.create({
        data: {
          id: this.FAVORITES_ID,
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }
  }

  async findAll(): Promise<FavoritesResponse> {
    const favorites = await this.getOrCreateFavorites();

    const artists =
      favorites.artists.length > 0
        ? await this.prisma.artist.findMany({
            where: { id: { in: favorites.artists } },
          })
        : [];

    const albums =
      favorites.albums.length > 0
        ? await this.prisma.album.findMany({
            where: { id: { in: favorites.albums } },
          })
        : [];

    const tracks =
      favorites.tracks.length > 0
        ? await this.prisma.track.findMany({
            where: { id: { in: favorites.tracks } },
          })
        : [];

    return { artists, albums, tracks };
  }

  async addTrack(trackId: string): Promise<boolean> {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!track) {
      return false;
    }

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.tracks.includes(trackId)) {
      await this.prisma.favorites.update({
        where: { id: this.FAVORITES_ID },
        data: {
          tracks: { push: trackId },
        },
      });
    }
    return true;
  }

  async removeTrack(trackId: string): Promise<boolean> {
    const favorites = await this.getOrCreateFavorites();

    if (!favorites.tracks.includes(trackId)) {
      return false;
    }

    const updatedTracks = favorites.tracks.filter((id) => id !== trackId);

    await this.prisma.favorites.update({
      where: { id: this.FAVORITES_ID },
      data: {
        tracks: updatedTracks,
      },
    });

    return true;
  }

  async addAlbum(albumId: string): Promise<boolean> {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      return false;
    }

    const favorites = await this.getOrCreateFavorites();
    if (!favorites.albums.includes(albumId)) {
      await this.prisma.favorites.update({
        where: { id: this.FAVORITES_ID },
        data: {
          albums: { push: albumId },
        },
      });
    }
    return true;
  }

  async removeAlbum(albumId: string): Promise<boolean> {
    const favorites = await this.getOrCreateFavorites();

    if (!favorites.albums.includes(albumId)) {
      return false;
    }

    const updatedAlbums = favorites.albums.filter((id) => id !== albumId);

    await this.prisma.favorites.update({
      where: { id: this.FAVORITES_ID },
      data: {
        albums: updatedAlbums,
      },
    });
    return true;
  }

  async addArtist(artistId: string): Promise<boolean> {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!artist) {
      return false;
    }

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.artists.includes(artistId)) {
      await this.prisma.favorites.update({
        where: { id: this.FAVORITES_ID },
        data: {
          artists: { push: artistId },
        },
      });
    }
    return true;
  }

  async removeArtist(artistId: string): Promise<boolean> {
    const favorites = await this.getOrCreateFavorites();

    if (!favorites.artists.includes(artistId)) {
      return false;
    }

    const updatedArtists = favorites.artists.filter((id) => id !== artistId);

    await this.prisma.favorites.update({
      where: { id: this.FAVORITES_ID },
      data: {
        artists: updatedArtists,
      },
    });
    return true;
  }
}
