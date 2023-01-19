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
import { ApiTags } from '@nestjs/swagger';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';
import { Trailer } from './entities/trailer.entity';

@ApiTags('Trailers')
@Controller('vehicles/trailers')
export class TrailersController {
  constructor(private readonly trailersService: TrailersService) {}

  @Post()
  create(@Body() createTrailerDto: CreateTrailerDto) {
    return this.trailersService.create(createTrailerDto);
  }

  @Get()
  async findAll(): Promise<Trailer[]> {
    const trailer = await this.trailersService.findAll();
    if (trailer.length > 0)
    {
     return trailer;
    }else{
     throw new CustomNotFoundException("Get all trailers failed. Trailer information does not exist in database yet.",HttpStatus.NOT_FOUND)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Trailer> {
    const trailer = await this.trailersService.findOne(id);
    if (trailer)
    {
     return trailer;
    }else{
     throw new CustomNotFoundException("Get trailer failed. Trailer with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTrailerDto: UpdateTrailerDto):Promise<Trailer> {
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
    return await this.trailersService.remove(id);
  }
}
