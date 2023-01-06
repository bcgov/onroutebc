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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Trailers')
@Controller('vehicles/trailers')
export class TrailersController {
  constructor(private readonly trailersService: TrailersService) {}

  @Post()
  create(@Body() createTrailerDto: CreateTrailerDto) {
    return this.trailersService.create(createTrailerDto);
  }

  @Get()
  findAll() {
    return this.trailersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trailersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrailerDto: UpdateTrailerDto) {
    return this.trailersService.update(id, updateTrailerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trailersService.remove(id);
  }
}
