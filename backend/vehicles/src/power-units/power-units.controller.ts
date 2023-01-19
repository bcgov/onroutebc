import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PowerUnitsService } from './power-units.service';
import { CreatePowerUnitDto } from './dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/request/update-power-unit.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReadPowerUnitDto } from './dto/response/read-power-unit.dto';

@ApiTags('Power Units')
@Controller('vehicles/powerUnits')
export class PowerUnitsController {
  constructor(private readonly powerUnitsService: PowerUnitsService) {}

  @ApiCreatedResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
  })
  @Post()
  create(@Body() createPowerUnitDto: CreatePowerUnitDto) {
    return this.powerUnitsService.create(createPowerUnitDto);
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.powerUnitsService.findAll();
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
  })
  @Get(':powerUnitId')
  findOne(@Param('powerUnitId') powerUnitId: string) {
    return this.powerUnitsService.findOne(powerUnitId);
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
  })
  @Put(':powerUnitId')
  update(
    @Param('powerUnitId') powerUnitId: string,
    @Body() updatePowerUnitDto: UpdatePowerUnitDto,
  ) {
    return this.powerUnitsService.update(powerUnitId, updatePowerUnitDto);
  }

  @Delete(':powerUnitId')
  remove(@Param('powerUnitId') powerUnitId: string) {
    return this.powerUnitsService.remove(powerUnitId);
  }
}
