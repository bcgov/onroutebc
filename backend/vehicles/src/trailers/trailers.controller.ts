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
import { CreateTrailerDto } from './dto/request/create-trailer.dto';
import { UpdateTrailerDto } from './dto/request/update-trailer.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';
import { ReadTrailerDto } from './dto/response/read-trailer.dto';

@ApiTags('Trailers')
@Controller('vehicles/trailers')
export class TrailersController {
  constructor(private readonly trailersService: TrailersService) {}

  @ApiCreatedResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
  })
  @Post()
  create(@Body() createTrailerDto: CreateTrailerDto) {
    return this.trailersService.create(createTrailerDto);
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<ReadTrailerDto[]> {
    return await this.trailersService.findAll();
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
  })
  @Get(':trailerId')
  async findOne(@Param('trailerId') trailerId: string): Promise<ReadTrailerDto> {
    const trailer = await this.trailersService.findOne(trailerId);
    if (trailer)
    {
     return trailer;
    }else{
     throw new CustomNotFoundException("Data not found",HttpStatus.NOT_FOUND)
    }
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
  })
  @Put(':trailerId')
  async update(@Param('trailerId') trailerId: string, @Body() updateTrailerDto: UpdateTrailerDto):Promise<ReadTrailerDto> {
    const trailer = await this.trailersService.update(trailerId, updateTrailerDto);
    if (trailer)
    {
     return trailer;
    }else{
     throw new CustomNotFoundException("Data not found",HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':trailerId')
  async remove(@Param('trailerId') trailerId: string) {
    const deleteResult = await this.trailersService.remove(+trailerId);
    if(deleteResult.affected > 0 )
    {
      return { deleted: true };
    }else{
      throw new CustomNotFoundException("Data not found",HttpStatus.NOT_FOUND)

    }
  }
}
