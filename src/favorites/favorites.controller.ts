import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(@Param('id') id: string) {
    const result = this.favoritesService.addTrack(id);
    if (!result) {
      throw new UnprocessableEntityException('Track not found');
    }
    return result;
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(@Param('id') id: string) {
    const result = this.favoritesService.removeTrack(id);
    if (!result) {
      throw new NotFoundException('Track not found in favorites');
    }
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id') id: string) {
    const result = this.favoritesService.addAlbum(id);
    if (!result) {
      throw new UnprocessableEntityException('Album not found');
    }
    return result;
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(@Param('id') id: string) {
    const result = this.favoritesService.removeAlbum(id);
    if (!result) {
      throw new NotFoundException('Album not found in favorites');
    }
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id') id: string) {
    const result = this.favoritesService.addArtist(id);
    if (!result) {
      throw new UnprocessableEntityException('Artist not found');
    }
    return result;
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(@Param('id') id: string) {
    const result = this.favoritesService.removeArtist(id);
    if (!result) {
      throw new NotFoundException('Artist not found in favorites');
    }
  }
}
