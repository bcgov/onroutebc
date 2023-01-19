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
import { CreateTrailerTypeDto } from './dto/request/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/request/update-trailer-type.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReadTrailerTypeDto } from './dto/response/read-trailer-type.dto';

@ApiTags('Trailer Types')
@Controller('vehicles/trailer-types')
export class TrailerTypesController {
  constructor(private readonly trailerTypesService: TrailerTypesService) {}

  @ApiCreatedResponse({
    description: 'The Trailer Type Resource',
    type: ReadTrailerTypeDto,
  })
  @Post()
  create(@Body() createTrailerTypeDto: CreateTrailerTypeDto) {
    return this.trailerTypesService.create(createTrailerTypeDto);
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: ReadTrailerTypeDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.trailerTypesService.findAll();
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: ReadTrailerTypeDto,
  })
  @Get(':typeCode')
  findOne(@Param('typeCode') typeCode: string) {
    return this.trailerTypesService.findOne(typeCode);
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: ReadTrailerTypeDto,
  })
  @Put(':typeCode')
  update(
    @Param('typeCode') typeCode: string,
    @Body() updateTrailerTypeDto: UpdateTrailerTypeDto,
  ) {
    return this.trailerTypesService.update(typeCode, updateTrailerTypeDto);
  }

  @Delete(':typeCode')
  remove(@Param('typeCode') typeCode: string) {
    return this.trailerTypesService.remove(typeCode);
  }
}
