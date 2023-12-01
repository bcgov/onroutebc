import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { TrailersService } from './trailers.service';
import { CreateTrailerDto } from './dto/request/create-trailer.dto';
import { UpdateTrailerDto } from './dto/request/update-trailer.dto';
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

import { ReadTrailerDto } from './dto/response/read-trailer.dto';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { Request } from 'express';
import { Roles } from '../../../common/decorator/roles.decorator';
import { Role } from '../../../common/enum/roles.enum';
import { DeleteDto } from 'src/modules/common/dto/response/delete.dto';
import { DeleteTrailerDto } from './dto/request/delete-trailer.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';

@ApiTags('Vehicles - Trailers')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
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
    const currentUser = request.user as IUserJWT;
    return this.trailersService.create(
      companyId,
      createTrailerDto,
      currentUser,
    );
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
    isArray: true,
  })
  @Roles(Role.READ_VEHICLE)
  @Get()
  async findAll(
    @Param('companyId') companyId: number,
  ): Promise<ReadTrailerDto[]> {
    return await this.trailersService.findAll(companyId);
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
  })
  @Roles(Role.READ_VEHICLE)
  @Get(':trailerId')
  async findOne(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('trailerId') trailerId: string,
  ): Promise<ReadTrailerDto> {
    const trailer = await this.checkVehicleCompanyContext(companyId, trailerId);
    if (!trailer) {
      throw new DataNotFoundException();
    }
    return trailer;
  }

  @ApiOkResponse({
    description: 'The Trailer Resource',
    type: ReadTrailerDto,
  })
  @Roles(Role.WRITE_VEHICLE)
  @Put(':trailerId')
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('trailerId') trailerId: string,
    @Body() updateTrailerDto: UpdateTrailerDto,
  ): Promise<ReadTrailerDto> {
    const currentUser = request.user as IUserJWT;
    await this.checkVehicleCompanyContext(companyId, trailerId);
    const trailer = await this.trailersService.update(
      companyId,
      trailerId,
      updateTrailerDto,
      currentUser,
    );
    if (!trailer) {
      throw new DataNotFoundException();
    }
    return trailer;
  }

  @Roles(Role.WRITE_VEHICLE)
  @Delete(':trailerId')
  async remove(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('trailerId') trailerId: string,
  ) {
    await this.checkVehicleCompanyContext(companyId, trailerId);
    const deleteResult = await this.trailersService.remove(
      companyId,
      trailerId,
    );
    if (deleteResult.affected === 0) {
      throw new DataNotFoundException();
    }
    return { deleted: true };
  }

  @ApiOkResponse({
    description:
      'The delete dto resource which includes the success and failure list.',
    type: DeleteDto,
  })
  @Roles(Role.WRITE_VEHICLE)
  @HttpCode(200)
  @Post('delete-requests')
  async deleteTrailers(
    @Body() deleteTrailerDto: DeleteTrailerDto,
    @Param('companyId') companyId: number,
  ): Promise<DeleteDto> {
    const deleteResult = await this.trailersService.removeAll(
      deleteTrailerDto.trailers,
      companyId,
    );

    if (deleteResult == null) {
      throw new DataNotFoundException();
    }
    return deleteResult;
  }

  private async checkVehicleCompanyContext(
    companyId: number,
    trailerId: string,
  ) {
    const vehicle = await this.trailersService.findOne(undefined, trailerId);
    if (vehicle && vehicle?.companyId != companyId) {
      throw new ForbiddenException();
    }
    return vehicle;
  }
}
