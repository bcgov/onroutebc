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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReadTrailerTypeDto } from './dto/response/read-trailer-type.dto';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/roles.enum';
import { AuthOnly } from '../../../common/decorator/auth-only.decorator';

@ApiTags('Vehicles - Trailer Types')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
@ApiNotFoundResponse({
  description: 'The Trailer Type Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Trailer Type Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Trailer Type Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('vehicles/trailer-types')
export class TrailerTypesController {
  constructor(private readonly trailerTypesService: TrailerTypesService) {}

  @ApiCreatedResponse({
    description: 'The Trailer Type Resource',
    type: ReadTrailerTypeDto,
  })
  @Roles(Role.WRITE_VEHICLE_TYPES)
  @Post()
  create(@Body() createTrailerTypeDto: CreateTrailerTypeDto) {
    return this.trailerTypesService.create(createTrailerTypeDto);
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: ReadTrailerTypeDto,
    isArray: true,
  })
  @AuthOnly()
  @Get()
  async findAll(): Promise<ReadTrailerTypeDto[]> {
    return await this.trailerTypesService.findAll();
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: ReadTrailerTypeDto,
  })
  @AuthOnly()
  @Get(':typeCode')
  async findOne(
    @Param('typeCode') typeCode: string,
  ): Promise<ReadTrailerTypeDto> {
    const trailerType = await this.trailerTypesService.findOne(typeCode);
    if (!trailerType) {
      throw new DataNotFoundException();
    }
    return trailerType;
  }

  @ApiOkResponse({
    description: 'The Trailer Type Resource',
    type: ReadTrailerTypeDto,
  })
  @Roles(Role.WRITE_VEHICLE_TYPES)
  @Put(':typeCode')
  async update(
    @Param('typeCode') typeCode: string,
    @Body() updateTrailerTypeDto: UpdateTrailerTypeDto,
  ): Promise<ReadTrailerTypeDto> {
    const trailerType = await this.trailerTypesService.update(
      typeCode,
      updateTrailerTypeDto,
    );
    if (!trailerType) {
      throw new DataNotFoundException();
    }
    return trailerType;
  }

  @Roles(Role.WRITE_VEHICLE_TYPES)
  @Delete(':typeCode')
  async remove(@Param('typeCode') typeCode: string) {
    const deleteResult = await this.trailerTypesService.remove(typeCode);
    if (deleteResult.affected === 0) {
      throw new DataNotFoundException();
    }
    return { deleted: true };
  }
}
