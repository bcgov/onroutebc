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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PowerUnitTypeDto } from './dto/power-unit-type.dto';

@ApiTags('Power Unit Types')
@Controller('vehicles/power-unit-types')
export class PowerUnitTypesController {
  constructor(private readonly powerUnitTypesService: PowerUnitTypesService) {}

  @ApiCreatedResponse({
    description: 'The Power Unit Type Resource',
    type: PowerUnitTypeDto,
  })
  @Post()
  create(@Body() createPowerUnitTypeDto: CreatePowerUnitTypeDto) {
    return this.powerUnitTypesService.create(createPowerUnitTypeDto);
  }

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: PowerUnitTypeDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.powerUnitTypesService.findAll();
  }

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: PowerUnitTypeDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.powerUnitTypesService.findOne(id);
  }

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: PowerUnitTypeDto,
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ) {
    return this.powerUnitTypesService.update(id, updatePowerUnitTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.powerUnitTypesService.remove(id);
  }
}
