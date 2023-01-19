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
import { TrailersService } from './trailers.service';
import { CreateTrailerDto } from './dto/create-trailer.dto';
import { UpdateTrailerDto } from './dto/update-trailer.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';
import { TrailerDto } from './dto/trailer.dto';

@ApiTags('Trailers')
@Controller('vehicles/trailers')
export class TrailersController {
  constructor(private readonly trailersService: TrailersService) {}

  @ApiCreatedResponse({
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
  async findAll(): Promise<TrailerDto[]> {
    const trailer = await this.trailersService.findAll();
    if (trailer.length > 0)
    {
     return trailer;
    }else{
     throw new CustomNotFoundException("Get all trailers failed. Trailer information does not exist in database yet.",HttpStatus.NOT_FOUND)
    }
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: TrailerDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TrailerDto> {
    const trailer = await this.trailersService.findOne(id);
    if (trailer)
    {
     return trailer;
    }else{
     throw new CustomNotFoundException("Get trailer failed. Trailer with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: TrailerDto,
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTrailerDto: UpdateTrailerDto):Promise<TrailerDto> {
    const trailer = await this.trailersService.update(id, updateTrailerDto);
    if (trailer)
    {
     return trailer;
    }else{
     throw new CustomNotFoundException("Update trailer failed. Trailer with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteResult = await this.trailersService.remove(+id);
    if(deleteResult.affected > 0 )
    {
      return { deleted: true };
    }else{
      throw new CustomNotFoundException("Delete trailer failed. Trailer with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)

    }
  }
}
