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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { IsUUIDParam } from '../shared/decorators/is-uuid-param.decorator';

@ApiTags('Artists')
@ApiBearerAuth()
@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all artists',
    description: 'Retrieve a list of all artists',
  })
  @ApiResponse({
    status: 200,
    description: 'List of artists retrieved successfully',
    type: [Artist],
  })
  getAllArtists() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get artist by ID',
    description: 'Retrieve a specific artist by their ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Artist UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Artist retrieved successfully',
    type: Artist,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Artist not found',
  })
  getArtistById(@IsUUIDParam('id') id: string) {
    return this.artistsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new artist',
    description: 'Create a new artist with name and grammy award status',
  })
  @ApiBody({ type: CreateArtistDto })
  @ApiResponse({
    status: 201,
    description: 'Artist created successfully',
    type: Artist,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  createArtist(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update artist',
    description: 'Update artist information',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Artist UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateArtistDto })
  @ApiResponse({
    status: 200,
    description: 'Artist updated successfully',
    type: Artist,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Artist not found',
  })
  updateArtist(
    @IsUUIDParam('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete artist',
    description:
      'Delete an artist by their ID. This will also remove artist references from tracks and albums.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Artist UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Artist deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Artist not found',
  })
  deleteArtist(@IsUUIDParam('id') id: string) {
    this.artistsService.remove(id);
  }
}
