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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReadPowerUnitTypeDto } from './dto/response/read-power-unit-type.dto';

@ApiTags('Power Unit Types')
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
  findAll() {
    return this.powerUnitTypesService.findAll();
  }

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: ReadPowerUnitTypeDto,
  })
  @Get(':typeCode')
  findOne(@Param('typeCode') typeCode: string) {
    return this.powerUnitTypesService.findOne(typeCode);
  }

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: ReadPowerUnitTypeDto,
  })
  @Put(':typeCode')
  update(
    @Param('typeCode') typeCode: string,
    @Body() updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ) {
    return this.powerUnitTypesService.update(typeCode, updatePowerUnitTypeDto);
  }

  @Delete(':typeCode')
  remove(@Param('typeCode') typeCode: string) {
    return this.powerUnitTypesService.remove(typeCode);
  }
}
