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
import { PowerUnitsService } from './power-units.service';
import { CreatePowerUnitDto } from './dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/request/update-power-unit.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ReadPowerUnitDto } from './dto/response/read-power-unit.dto';
import { ExceptionDto } from '../../common/dto/exception.dto';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { Request } from 'express';

@ApiTags('Vehicles - Power Units')
@ApiNotFoundResponse({
  description: 'The Power Unit Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Power Unit Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Power Unit Api Internal Server Error Response',
  type: ExceptionDto,
})
@ApiBearerAuth()
@Controller('companies/:companyId/vehicles/powerUnits')
export class PowerUnitsController {
  constructor(private readonly powerUnitsService: PowerUnitsService) {}

  @ApiCreatedResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
  })
  @Post()
  async create(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() createPowerUnitDto: CreatePowerUnitDto,
  ) {
    //const currentUser = request.user as IUserJWT;
    return await this.powerUnitsService.create(createPowerUnitDto);
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @Req() request: Request,
    @Param('companyId') companyId: number,
  ): Promise<ReadPowerUnitDto[]> {
    return await this.powerUnitsService.findAll();
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
  })
  @Get(':powerUnitId')
  async findOne(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('powerUnitId') powerUnitId: string,
  ): Promise<ReadPowerUnitDto> {
    const powerUnit = await this.powerUnitsService.findOne(powerUnitId);
    if (!powerUnit) {
      throw new DataNotFoundException();
    }
    return powerUnit;
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
  })
  @Put(':powerUnitId')
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('powerUnitId') powerUnitId: string,
    @Body() updatePowerUnitDto: UpdatePowerUnitDto,
  ): Promise<ReadPowerUnitDto> {
    //const currentUser = request.user as IUserJWT;
    const powerUnit = await this.powerUnitsService.update(
      powerUnitId,
      updatePowerUnitDto,
    );
    if (!powerUnit) {
      throw new DataNotFoundException();
    }
    return powerUnit;
  }

  @Delete(':powerUnitId')
  async remove(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('powerUnitId') powerUnitId: string,
  ) {
    //const currentUser = request.user as IUserJWT;
    const deleteResult = await this.powerUnitsService.remove(powerUnitId);
    if (deleteResult.affected === 0) {
      throw new DataNotFoundException();
    }
    return { deleted: true };
  }
}
