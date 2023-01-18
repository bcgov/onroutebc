import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TrailersService } from './trailers.service';
import { CreateTrailerDto } from './dto/create-trailer.dto';
import { UpdateTrailerDto } from './dto/update-trailer.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TrailerDto } from './dto/trailer.dto';

@ApiTags('Trailers')
@Controller('vehicles/trailers')
export class TrailersController {
  constructor(private readonly trailersService: TrailersService) {}

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: TrailerDto,
  })
  @Post()
  create(@Body() createTrailerDto: CreateTrailerDto) {
    return this.trailersService.create(createTrailerDto);
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: TrailerDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.trailersService.findAll();
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: TrailerDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trailersService.findOne(id);
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: TrailerDto,
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrailerDto: UpdateTrailerDto) {
    return this.trailersService.update(id, updateTrailerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trailersService.remove(id);
  }
}
