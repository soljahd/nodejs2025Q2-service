import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './interfaces/favorites-response.interface';
import { IsUUIDParam } from 'src/shared/decorators/is-uuid-param.decorator';

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all favorites',
    description: 'Retrieve all favorite artists, albums, and tracks',
  })
  @ApiResponse({
    status: 200,
    description: 'Favorites retrieved successfully',
    type: Object,
  })
  getAllFavorites(): FavoritesResponse {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add track to favorites',
    description: 'Add a track to favorites by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Track UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Track added to favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 422,
    description: 'Track not found - cannot add to favorites',
  })
  addTrackToFavorites(@IsUUIDParam('id') id: string) {
    const result = this.favoritesService.addTrack(id);
    if (!result) {
      throw new UnprocessableEntityException('Track not found');
    }
    return result;
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove track from favorites',
    description: 'Remove a track from favorites by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Track UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Track removed from favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Track not found in favorites',
  })
  removeTrackFromFavorites(@IsUUIDParam('id') id: string) {
    const result = this.favoritesService.removeTrack(id);
    if (!result) {
      throw new NotFoundException('Track not found in favorites');
    }
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add album to favorites',
    description: 'Add an album to favorites by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Album UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Album added to favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 422,
    description: 'Album not found - cannot add to favorites',
  })
  addAlbumToFavorites(@IsUUIDParam('id') id: string) {
    const result = this.favoritesService.addAlbum(id);
    if (!result) {
      throw new UnprocessableEntityException('Album not found');
    }
    return result;
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove album from favorites',
    description: 'Remove an album from favorites by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Album UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Album removed from favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Album not found in favorites',
  })
  removeAlbumFromFavorites(@IsUUIDParam('id') id: string) {
    const result = this.favoritesService.removeAlbum(id);
    if (!result) {
      throw new NotFoundException('Album not found in favorites');
    }
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add artist to favorites',
    description: 'Add an artist to favorites by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Artist UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Artist added to favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 422,
    description: 'Artist not found - cannot add to favorites',
  })
  addArtistToFavorites(@IsUUIDParam('id') id: string) {
    const result = this.favoritesService.addArtist(id);
    if (!result) {
      throw new UnprocessableEntityException('Artist not found');
    }
    return result;
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove artist from favorites',
    description: 'Remove an artist from favorites by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Artist UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Artist removed from favorites successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Artist not found in favorites',
  })
  removeArtistFromFavorites(@IsUUIDParam('id') id: string) {
    const result = this.favoritesService.removeArtist(id);
    if (!result) {
      throw new NotFoundException('Artist not found in favorites');
    }
  }
}
