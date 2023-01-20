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
import { CreateTrailerTypeDto } from './dto/request/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from './dto/request/update-trailer-type.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReadTrailerTypeDto } from './dto/response/read-trailer-type.dto';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';

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
  async findAll(): Promise<ReadTrailerTypeDto[]> {
    return await this.trailerTypesService.findAll();
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: ReadTrailerTypeDto,
  })
  @Get(':typeCode')
  async findOne(@Param('typeCode') typeCode: string): Promise<ReadTrailerTypeDto> {
    const trailerType = await this.trailerTypesService.findOne(typeCode);
    if (trailerType)
    {
     return trailerType;
    }else{
     throw new CustomNotFoundException("Data not found",HttpStatus.NOT_FOUND)
    }
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: ReadTrailerTypeDto,
  })
  @Put(':typeCode')
  async update(
    @Param('typeCode') typeCode: string,
    @Body() updateTrailerTypeDto: UpdateTrailerTypeDto,
  ): Promise<ReadTrailerTypeDto> {
    const trailerType = await this.trailerTypesService.update(typeCode, updateTrailerTypeDto);
    if (trailerType)
    {
     return trailerType;
    }else{
     throw new CustomNotFoundException("Data not found",HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':typeCode')
  async remove(@Param('typeCode') typeCode: string) {
    const deleteResult = await this.trailerTypesService.remove(typeCode);
    if(deleteResult.affected)
    {
      return { deleted: true };
    }
    else{
      throw new CustomNotFoundException("Data not found",HttpStatus.NOT_FOUND)

    }
  }
}
