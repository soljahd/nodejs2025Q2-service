import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { DataService } from '../shared/data.service';

@Injectable()
export class TracksService {
  constructor(@Inject(DataService) private readonly dataService: DataService) {}

  findAll(): Track[] {
    return this.dataService.tracks;
  }

  findOne(id: string): Track {
    const track = this.dataService.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const track: Track = {
      id: this.generateUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    this.dataService.tracks.push(track);
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const trackIndex = this.dataService.tracks.findIndex(
      (track) => track.id === id,
    );

    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack = Object.assign(
      this.dataService.tracks[trackIndex],
      updateTrackDto,
    );

    this.dataService.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string): void {
    const trackIndex = this.dataService.tracks.findIndex(
      (track) => track.id === id,
    );

    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.removeTrackFromFavorites(id);

    this.dataService.tracks.splice(trackIndex, 1);
  }

  removeArtistId(artistId: string): void {
    this.dataService.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  removeAlbumId(albumId: string): void {
    this.dataService.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }

  private removeTrackFromFavorites(trackId: string): void {
    const favIndex = this.dataService.favorites.tracks.indexOf(trackId);
    if (favIndex > -1) {
      this.dataService.favorites.tracks.splice(favIndex, 1);
    }
  }

  private generateUUID(): string {
    return crypto.randomUUID();
  }
}
