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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { IsUUIDParam } from '../shared/decorators/is-uuid-param.decorator';

@ApiTags('Tracks')
@ApiBearerAuth()
@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tracks',
    description: 'Retrieve a list of all tracks',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tracks retrieved successfully',
    type: [Track],
  })
  getAllTracks() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get track by ID',
    description: 'Retrieve a specific track by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Track UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Track retrieved successfully',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Track not found',
  })
  getTrackById(@IsUUIDParam('id') id: string) {
    return this.tracksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new track',
    description:
      'Create a new track with name, duration, and optional artist/album references',
  })
  @ApiBody({ type: CreateTrackDto })
  @ApiResponse({
    status: 201,
    description: 'Track created successfully',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  createTrack(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update track',
    description: 'Update track information',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Track UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateTrackDto })
  @ApiResponse({
    status: 200,
    description: 'Track updated successfully',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Track not found',
  })
  updateTrack(
    @IsUUIDParam('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete track',
    description:
      'Delete a track by its ID. This will also remove the track from favorites if present.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Track UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Track deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Track not found',
  })
  async deleteTrack(@IsUUIDParam('id') id: string) {
    await this.tracksService.remove(id);
  }
}
