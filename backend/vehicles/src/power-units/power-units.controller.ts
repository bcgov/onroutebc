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
import { PowerUnitsService } from './power-units.service';
import { CreatePowerUnitDto } from './dto/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/update-power-unit.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';
import { PowerUnit } from './entities/power-unit.entity';
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
  async findAll():Promise<PowerUnit[]> {
   const powerUnit = await  this.powerUnitsService.findAll();
   if (powerUnit.length > 0)
   {
    return powerUnit;
   }else{
    throw new CustomNotFoundException("Get all power unit failed.Power unit data do not exist in database yet",HttpStatus.NOT_FOUND)
   }
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: PowerUnitDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PowerUnit> {
    const powerUnit = await this.powerUnitsService.findOne(id);
    if (powerUnit)
    {
    return powerUnit
  }
    else 
    {
    throw new CustomNotFoundException("Get power unit failed. Power unit with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: PowerUnitDto,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePowerUnitDto: UpdatePowerUnitDto,
  ): Promise<PowerUnit> {
    const powerUnit = await this.powerUnitsService.update(id, updatePowerUnitDto);
    if (powerUnit)
    {
    return powerUnit
  }
    else 
    {
    throw new CustomNotFoundException("Update power unit failed. Power unit with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':id')
 async remove(@Param('id') id: string) {
    const deleteResult =  await this.powerUnitsService.remove(id);
    if (deleteResult.affected >0)
      {
        return { deleted: true };
      }
      else{
        throw new CustomNotFoundException("Delete power unit failed. Power unit with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)

      }
      
  }
}
