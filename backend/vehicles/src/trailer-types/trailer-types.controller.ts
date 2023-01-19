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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TrailerTypeDto } from './dto/trailer-type.dto';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';

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
  async findAll(): Promise<TrailerTypeDto[]> {
    const trailerType = await this.trailerTypesService.findAll();
    if (trailerType.length > 0)
    {
     return trailerType;
    }else{
     throw new CustomNotFoundException("Get all trailer types failed.Trailer types do not exist in database yet",HttpStatus.NOT_FOUND)
    }
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: TrailerTypeDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TrailerTypeDto> {
    const trailerType = await this.trailerTypesService.findOne(id);
    if (trailerType)
    {
     return trailerType;
    }else{
     throw new CustomNotFoundException("Get trailer types failed.Trailer type with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: TrailerTypeDto,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrailerTypeDto: UpdateTrailerTypeDto,
  ): Promise<TrailerTypeDto> {
    const trailerType = await this.trailerTypesService.update(id, updateTrailerTypeDto);
    if (trailerType)
    {
     return trailerType;
    }else{
     throw new CustomNotFoundException("Update trailer types failed.Trailer type with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteResult = await this.trailerTypesService.remove(id);
    if(deleteResult.affected)
    {
      return { deleted: true };
    }
    else{
      throw new CustomNotFoundException("Delete trailer types failed.Trailer type with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)

    }
  }
}
