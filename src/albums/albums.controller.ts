import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { IsUUIDParam } from '../shared/decorators/is-uuid-param.decorator';

@ApiTags('Albums')
@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({ status: 200, description: 'Return all albums', type: [Album] })
  getAllAlbums() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Album ID' })
  @ApiResponse({ status: 200, description: 'Return album by ID', type: Album })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  getAlbumById(@IsUUIDParam('id') id: string) {
    return this.albumsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new album' })
  @ApiBody({ type: CreateAlbumDto })
  @ApiResponse({ status: 201, description: 'Album created', type: Album })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update album' })
  @ApiParam({ name: 'id', type: String, description: 'Album ID' })
  @ApiBody({ type: UpdateAlbumDto })
  @ApiResponse({ status: 200, description: 'Album updated', type: Album })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  updateAlbum(
    @IsUUIDParam('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete album' })
  @ApiParam({ name: 'id', type: String, description: 'Album ID' })
  @ApiResponse({ status: 204, description: 'Album deleted' })
  @ApiResponse({ status: 400, description: 'Invalid UUID' })
  @ApiResponse({ status: 404, description: 'Album not found' })
  async eleteAlbum(@IsUUIDParam('id') id: string) {
    await this.albumsService.remove(id);
  }
}
