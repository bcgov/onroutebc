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
import { PowerUnitsService } from './power-units.service';
import { CreatePowerUnitDto } from './dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/request/update-power-unit.dto';
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

import { ReadPowerUnitDto } from './dto/response/read-power-unit.dto';
import { ExceptionDto } from '../../../common/exception/exception.dto';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';
import { Request } from 'express';
import { Roles } from '../../../common/decorator/roles.decorator';
import { Role } from '../../../common/enum/roles.enum';
import { DeleteDto } from 'src/modules/common/dto/response/delete.dto';
import { DeletePowerUnitDto } from './dto/request/delete-power-units.dto';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';

@ApiTags('Vehicles - Power Units')
@ApiBadRequestResponse({
  description: 'Bad Request Response',
  type: ExceptionDto,
})
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
  @Roles(Role.WRITE_VEHICLE)
  @Post()
  async create(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Body() createPowerUnitDto: CreatePowerUnitDto,
  ) {
    const currentUser = request.user as IUserJWT;
    return await this.powerUnitsService.create(
      companyId,
      createPowerUnitDto,
      currentUser,
    );
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
    isArray: true,
  })
  @Roles(Role.READ_VEHICLE)
  @Get()
  async findAll(
    @Param('companyId') companyId: number,
  ): Promise<ReadPowerUnitDto[]> {
    return await this.powerUnitsService.findAll(companyId);
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
  })
  @Roles(Role.READ_VEHICLE)
  @Get(':powerUnitId')
  async findOne(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('powerUnitId') powerUnitId: string,
  ): Promise<ReadPowerUnitDto> {
    const powerUnit = await this.checkVehicleCompanyContext(
      companyId,
      powerUnitId,
    );
    if (!powerUnit) {
      throw new DataNotFoundException();
    }
    return powerUnit;
  }
  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
  })
  @Roles(Role.WRITE_VEHICLE)
  @Put(':powerUnitId')
  async update(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('powerUnitId') powerUnitId: string,
    @Body() updatePowerUnitDto: UpdatePowerUnitDto,
  ): Promise<ReadPowerUnitDto> {
    const currentUser = request.user as IUserJWT;
    await this.checkVehicleCompanyContext(companyId, powerUnitId);
    const powerUnit = await this.powerUnitsService.update(
      companyId,
      powerUnitId,
      updatePowerUnitDto,
      currentUser,
    );
    if (!powerUnit) {
      throw new DataNotFoundException();
    }
    return powerUnit;
  }

  @Roles(Role.WRITE_VEHICLE)
  @Delete(':powerUnitId')
  async remove(
    @Req() request: Request,
    @Param('companyId') companyId: number,
    @Param('powerUnitId') powerUnitId: string,
  ) {
    //const currentUser = request.user as IUserJWT;
    await this.checkVehicleCompanyContext(companyId, powerUnitId);
    const deleteResult = await this.powerUnitsService.remove(
      companyId,
      powerUnitId,
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
  @Post('delete-requests')
  @HttpCode(200)
  async deletePowerUnits(
    @Body() deletePowerUnitDto: DeletePowerUnitDto,
    @Param('companyId') companyId: number,
  ): Promise<DeleteDto> {
    const deleteResult = await this.powerUnitsService.removeAll(
      deletePowerUnitDto.powerUnits,
      companyId,
    );
    if (deleteResult == null) {
      throw new DataNotFoundException();
    }
    return deleteResult;
  }

  private async checkVehicleCompanyContext(
    companyId: number,
    powerUnitId: string,
  ) {
    const vehicle = await this.powerUnitsService.findOne(
      undefined,
      powerUnitId,
    );
    if (vehicle && vehicle?.companyId != companyId) {
      throw new ForbiddenException();
    }
    return vehicle;
  }
}
