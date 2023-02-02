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
import { CreateTrailerDto } from './dto/request/create-trailer.dto';
import { UpdateTrailerDto } from './dto/request/update-trailer.dto';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataNotFoundException } from 'src/common/exception/data-not-found.exception';
import { ReadTrailerDto } from './dto/response/read-trailer.dto';
import { ExceptionDto } from 'src/common/dto/exception.dto';

@ApiTags('Trailers')
@ApiNotFoundResponse({
  description: 'The Trailer Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Trailer Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Trailer Api Internal Server Error Response',
  type: ExceptionDto,
})
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
  async findOne(
    @Param('trailerId') trailerId: string,
  ): Promise<ReadTrailerDto> {
    const trailer = await this.trailersService.findOne(trailerId);
    if (!trailer) {
      throw new DataNotFoundException();
    }
    return trailer;
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
  })
  @Put(':trailerId')
  async update(
    @Param('trailerId') trailerId: string,
    @Body() updateTrailerDto: UpdateTrailerDto,
  ): Promise<ReadTrailerDto> {
    const trailer = await this.trailersService.update(
      trailerId,
      updateTrailerDto,
    );
    if (!trailer) {
      throw new DataNotFoundException();
    }
    return trailer;
  }

  @Delete(':trailerId')
  async remove(@Param('trailerId') trailerId: string) {
    const deleteResult = await this.trailersService.remove(trailerId);
    if (deleteResult.affected > 0) {
      return { deleted: true };
    } else {
      throw new DataNotFoundException();
    }
  }
}
