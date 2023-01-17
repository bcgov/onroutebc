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
import { ApiTags } from '@nestjs/swagger';
import { PowerUnitDto } from './dto/power-unit.dto';

@ApiTags('Power Units')
@Controller('vehicles/powerUnits')
export class PowerUnitsController {
  constructor(private readonly powerUnitsService: PowerUnitsService) {}

  @Post()
  create(@Body() createPowerUnitDto: CreatePowerUnitDto) {
    return this.powerUnitsService.create(createPowerUnitDto);
  }

  @Get()
  findAll() {
    return this.powerUnitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) : Promise<PowerUnitDto> {
     return this.powerUnitsService.findOne(id);
  }

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
