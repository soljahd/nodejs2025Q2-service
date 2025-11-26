import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  getAllAlbums() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  getAlbumById(@Param('id') id: string) {
    return this.albumsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || typeof createAlbumDto.year !== 'number') {
      throw new BadRequestException('Invalid required data');
    }
    return this.albumsService.create(createAlbumDto);
  }

  @Put(':id')
  updateAlbum(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string) {
    this.albumsService.remove(id);
  }
}
