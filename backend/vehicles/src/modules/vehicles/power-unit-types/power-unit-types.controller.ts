import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PowerUnitTypesService } from './power-unit-types.service';
import { CreatePowerUnitTypeDto } from './dto/request/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from './dto/request/update-power-unit-type.dto';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReadPowerUnitTypeDto } from './dto/response/read-power-unit-type.dto';
import { ExceptionDto } from '../../../common/dto/exception.dto';
import { DataNotFoundException } from '../../../common/exception/data-not-found.exception';

@ApiTags('Power Unit Types')
@ApiNotFoundResponse({
  description: 'The Power Unit Type Api Not Found Response',
  type: ExceptionDto,
})
@ApiMethodNotAllowedResponse({
  description: 'The Power Unit Type Api Method Not Allowed Response',
  type: ExceptionDto,
})
@ApiInternalServerErrorResponse({
  description: 'The Power Unit Type Api Internal Server Error Response',
  type: ExceptionDto,
})
@Controller('vehicles/power-unit-types')
export class PowerUnitTypesController {
  constructor(private readonly powerUnitTypesService: PowerUnitTypesService) {}

  @ApiCreatedResponse({
    description: 'The Power Unit Type Resource',
    type: ReadPowerUnitTypeDto,
  })
  @Post()
  create(@Body() createPowerUnitTypeDto: CreatePowerUnitTypeDto) {
    return this.powerUnitTypesService.create(createPowerUnitTypeDto);
  }

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: ReadPowerUnitTypeDto,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<ReadPowerUnitTypeDto[]> {
    return await this.powerUnitTypesService.findAll();
  }

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: ReadPowerUnitTypeDto,
  })
  @Get(':typeCode')
  async findOne(
    @Param('typeCode') typeCode: string,
  ): Promise<ReadPowerUnitTypeDto> {
    const powerUnitType = await this.powerUnitTypesService.findOne(typeCode);
    if (!powerUnitType) {
      throw new DataNotFoundException();
    }
    return powerUnitType;
  }

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: ReadPowerUnitTypeDto,
  })
  @Put(':typeCode')
  async update(
    @Param('typeCode') typeCode: string,
    @Body() updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ): Promise<ReadPowerUnitTypeDto> {
    const powerUnitType = await this.powerUnitTypesService.update(
      typeCode,
      updatePowerUnitTypeDto,
    );
    if (!powerUnitType) {
      throw new DataNotFoundException();
    }
    return powerUnitType;
  }

  @Delete(':typeCode')
  async remove(@Param('typeCode') typeCode: string) {
    const deleteResult = await this.powerUnitTypesService.remove(typeCode);
    if (deleteResult.affected === 0) {
      throw new DataNotFoundException();
    }
    return { deleted: true };
  }
}
