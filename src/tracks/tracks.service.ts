import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany();
    return tracks;
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = await this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
        duration: createTrackDto.duration,
      },
    });
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const existingTrack = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!existingTrack) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });

    return updatedTrack;
  }

  async remove(id: string): Promise<void> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    await this.prisma.track.delete({
      where: { id },
    });
  }
}
