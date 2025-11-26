import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { DataService } from '../shared/data.service';

@Injectable()
export class AlbumsService {
  constructor(@Inject(DataService) private readonly dataService: DataService) {}

  findAll(): Album[] {
    return this.dataService.albums;
  }

  findOne(id: string): Album {
    if (!uuidValidate(id)) {
      throw new BadRequestException('ID is invalid (not uuid)');
    }

    const album = this.dataService.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const album: Album = {
      id: this.generateUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    this.dataService.albums.push(album);
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    if (!uuidValidate(id)) {
      throw new BadRequestException('ID is invalid (not uuid)');
    }

    const albumIndex = this.dataService.albums.findIndex(
      (album) => album.id === id,
    );

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    const updatedAlbum = Object.assign(
      this.dataService.albums[albumIndex],
      updateAlbumDto,
    );

    this.dataService.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('ID is invalid (not uuid)');
    }

    const albumIndex = this.dataService.albums.findIndex(
      (album) => album.id === id,
    );

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.removeAlbumIdFromTracks(id);
    this.removeAlbumFromFavorites(id);

    this.dataService.albums.splice(albumIndex, 1);
  }

  removeArtistId(artistId: string): void {
    this.dataService.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }

  private removeAlbumIdFromTracks(albumId: string): void {
    this.dataService.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }

  private removeAlbumFromFavorites(albumId: string): void {
    const favIndex = this.dataService.favorites.albums.indexOf(albumId);
    if (favIndex > -1) {
      this.dataService.favorites.albums.splice(favIndex, 1);
    }
  }

  private generateUUID(): string {
    return crypto.randomUUID();
  }
}
