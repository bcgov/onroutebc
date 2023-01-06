import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrailerTypesService } from './trailer-types.service';
import { CreateTrailerTypeDto } from './dto/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/update-trailer-type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Trailer Types')
@Controller('vehicles/trailer-types')
export class TrailerTypesController {
  constructor(private readonly trailerTypesService: TrailerTypesService) {}

  @Post()
  create(@Body() createTrailerTypeDto: CreateTrailerTypeDto) {
    return this.trailerTypesService.create(createTrailerTypeDto);
  }

  @Get()
  findAll() {
    return this.trailerTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trailerTypesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrailerTypeDto: UpdateTrailerTypeDto,
  ) {
    return this.trailerTypesService.update(+id, updateTrailerTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trailerTypesService.remove(+id);
  }
}
