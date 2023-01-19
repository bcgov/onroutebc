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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';
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
  async findAll():Promise<PowerUnitTypeDto[]>  {
    const powerUnitType = await this.powerUnitTypesService.findAll();
    if (powerUnitType.length > 0)
   {
    return powerUnitType;
   }else{
    throw new CustomNotFoundException("Get all power unit failed.Power unit types do not exist in database yet",HttpStatus.NOT_FOUND)
   }
  }
  

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: PowerUnitTypeDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string):Promise<PowerUnitTypeDto> {
    const powerUnitType = await this.powerUnitTypesService.findOne(id);
    if (powerUnitType)
   {
    return powerUnitType;
   }else{
    throw new CustomNotFoundException("Get power unit failed. Power unit with id "+id+" does not exist in database",HttpStatus.NOT_FOUND)
   }
  }

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: PowerUnitTypeDto,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ): Promise<PowerUnitTypeDto> {
    const powerUnitType = await this.powerUnitTypesService.update(id, updatePowerUnitTypeDto);
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
