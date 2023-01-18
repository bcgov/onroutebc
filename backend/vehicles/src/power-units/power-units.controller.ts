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
import { CreatePowerUnitDto } from './dto/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/update-power-unit.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PowerUnitDto } from './dto/power-unit.dto';

@ApiTags('Power Units')
@Controller('vehicles/powerUnits')
export class PowerUnitsController {
  constructor(private readonly powerUnitsService: PowerUnitsService) {}

  @ApiCreatedResponse({
    description: 'The Power Unit Resource',
    type: PowerUnitDto,
  })
  @Post()
  create(@Body() createPowerUnitDto: CreatePowerUnitDto) {
    return this.powerUnitsService.create(createPowerUnitDto);
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: PowerUnitDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.powerUnitsService.findAll();
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: PowerUnitDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.powerUnitsService.findOne(id);
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: PowerUnitDto,
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePowerUnitDto: UpdatePowerUnitDto,
  ) {
    return this.powerUnitsService.update(id, updatePowerUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.powerUnitsService.remove(id);
  }
}
