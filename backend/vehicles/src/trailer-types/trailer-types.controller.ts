import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TrailerTypesService } from './trailer-types.service';
import { CreateTrailerTypeDto } from './dto/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/update-trailer-type.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TrailerTypeDto } from './dto/trailer-type.dto';

@ApiTags('Trailer Types')
@Controller('vehicles/trailer-types')
export class TrailerTypesController {
  constructor(private readonly trailerTypesService: TrailerTypesService) {}

  @ApiCreatedResponse({
    description: 'The Trailer Type Resource',
    type: TrailerTypeDto,
  })
  @Post()
  create(@Body() createTrailerTypeDto: CreateTrailerTypeDto) {
    return this.trailerTypesService.create(createTrailerTypeDto);
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: TrailerTypeDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.trailerTypesService.findAll();
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: TrailerTypeDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trailerTypesService.findOne(id);
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: TrailerTypeDto,
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrailerTypeDto: UpdateTrailerTypeDto,
  ) {
    return this.trailerTypesService.update(id, updateTrailerTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trailerTypesService.remove(id);
  }
}
