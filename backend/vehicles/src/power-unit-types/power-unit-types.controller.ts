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
import { CreatePowerUnitTypeDto } from './dto/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from './dto/update-power-unit-type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Power Unit Types')
@Controller('vehicles/power-unit-types')
export class PowerUnitTypesController {
  constructor(private readonly powerUnitTypesService: PowerUnitTypesService) {}

  @Post()
  create(@Body() createPowerUnitTypeDto: CreatePowerUnitTypeDto) {
    return this.powerUnitTypesService.create(createPowerUnitTypeDto);
  }

  @Get()
  findAll() {
    return this.powerUnitTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.powerUnitTypesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ) {
    return this.powerUnitTypesService.update(+id, updatePowerUnitTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.powerUnitTypesService.remove(+id);
  }
}
