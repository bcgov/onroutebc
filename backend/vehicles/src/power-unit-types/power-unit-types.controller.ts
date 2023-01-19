import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { PowerUnitTypesService } from './power-unit-types.service';
import { CreatePowerUnitTypeDto } from './dto/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from './dto/update-power-unit-type.dto';
import { ApiTags } from '@nestjs/swagger';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';
import { PowerUnitType } from './entities/power-unit-type.entity';

@ApiTags('Power Unit Types')
@Controller('vehicles/power-unit-types')
export class PowerUnitTypesController {
  constructor(private readonly powerUnitTypesService: PowerUnitTypesService) {}

  @Post()
  create(@Body() createPowerUnitTypeDto: CreatePowerUnitTypeDto) {
    return this.powerUnitTypesService.create(createPowerUnitTypeDto);
  }

  @Get()
  async findAll():Promise<PowerUnitType[]>  {
    const powerUnitType = await this.powerUnitTypesService.findAll();
    if (powerUnitType.length > 0)
   {
    return powerUnitType;
   }else{
    throw new CustomNotFoundException("Get all power unit failed.Power unit types do not exist in database yet",HttpStatus.NOT_FOUND)
   }
  }
  

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<PowerUnitType> {
    const powerUnitType = await this.powerUnitTypesService.findOne(+id);
    if (powerUnitType)
   {
    return powerUnitType;
   }else{
    throw new CustomNotFoundException("Get power unit failed. Power unit with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
   }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ) {
    const powerUnitType = await this.powerUnitTypesService.update(+id, updatePowerUnitTypeDto);
    if (powerUnitType)
    {
    return powerUnitType
  }
    else 
    {
    throw new CustomNotFoundException("Update power unit type failed. Power unit type with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteResult = await this.powerUnitTypesService.remove(+id);
    if(deleteResult.affected >0)
    {
      return { deleted: true };
    }else{
      throw new CustomNotFoundException("Delete power unit type failed. Power unit type with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)

    }
  }
}
