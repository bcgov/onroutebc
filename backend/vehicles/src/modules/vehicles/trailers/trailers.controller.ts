import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { TrailersService } from './trailers.service';
import { CreateTrailerDto } from './dto/request/create-trailer.dto';
import { UpdateTrailerDto } from './dto/request/update-trailer.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ReadTrailerDto } from './dto/response/read-trailer.dto';
import { ExceptionDto } from '../../common/dto/exception.dto';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { Request } from 'express';
import { Roles } from '../../../common/decorator/roles.decorator';
import { Role } from '../../../common/enum/roles.enum';

@ApiTags('Vehicles - Trailers')
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
@ApiBearerAuth()
@Controller('companies/:companyId/vehicles/trailers')
export class TrailersController {
  constructor(private readonly trailersService: TrailersService) {}

  @ApiCreatedResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
  })
  @Roles(Role.WRITE_VEHICLE)
  @Post()
  create(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() createTrailerDto: CreateTrailerDto,
  ) {
    return this.trailersService.create(createTrailerDto);
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @Param('companyId') companyId: number,
  ): Promise<ReadTrailerDto[]> {
    return await this.trailersService.findAll();
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
  })
  @Get(':trailerId')
  async findOne(
    @Req() request: Request,
    @Param('companyId') companyId: number,
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
    @Req() request: Request,
    @Param('companyId') companyId: number,
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
  async remove(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('trailerId') trailerId: string,
  ) {
    const deleteResult = await this.trailersService.remove(trailerId);
    if (deleteResult.affected === 0) {
      throw new DataNotFoundException();
    }
    return { deleted: true };
  }
}
