import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { TrailerTypesService } from './trailer-types.service';
import { CreateTrailerTypeDto } from './dto/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/update-trailer-type.dto';
import { ApiTags } from '@nestjs/swagger';
import { TrailerType } from './entities/trailer-type.entity';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';

@ApiTags('Trailer Types')
@Controller('vehicles/trailer-types')
export class TrailerTypesController {
  constructor(private readonly trailerTypesService: TrailerTypesService) {}

  @Post()
  create(@Body() createTrailerTypeDto: CreateTrailerTypeDto) {
    return this.trailerTypesService.create(createTrailerTypeDto);
  }

  @Get()
  async findAll(): Promise<TrailerType[]> {
    const trailerType = await this.trailerTypesService.findAll();
    if (trailerType.length > 0)
    {
     return trailerType;
    }else{
     throw new CustomNotFoundException("Get all trailer types failed.Trailer types do not exist in database yet",HttpStatus.NOT_FOUND)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const trailerType = await this.trailerTypesService.findOne(+id);
    if (trailerType)
    {
     return trailerType;
    }else{
     throw new CustomNotFoundException("Get trailer types failed.Trailer type with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrailerTypeDto: UpdateTrailerTypeDto,
  ) {
    const trailerType = await this.trailerTypesService.update(+id, updateTrailerTypeDto);
    if (trailerType)
    {
     return trailerType;
    }else{
     throw new CustomNotFoundException("Update trailer types failed.Trailer type with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.trailerTypesService.remove(+id);
  }
}
