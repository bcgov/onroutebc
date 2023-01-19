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
import { CreatePowerUnitDto } from './dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from './dto/request/update-power-unit.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';
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
  async findAll():Promise<ReadPowerUnitDto[]> {
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
    type: ReadPowerUnitDto,
  })
  @Get(':powerUnitId')
  async findOne(@Param('powerUnitId') powerUnitId: string): Promise<ReadPowerUnitDto> {
    const powerUnit = await this.powerUnitsService.findOne(powerUnitId);
    if (powerUnit)
    {
    return powerUnit
  }
    else 
    {
    throw new CustomNotFoundException("Get power unit failed. Power unit with id "+powerUnitId+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @ApiOkResponse({
    description: 'The Power Unit Resource',
    type: ReadPowerUnitDto,
  })
  @Put(':powerUnitId')
  async update(
    @Param('powerUnitId') powerUnitId: string,
    @Body() updatePowerUnitDto: UpdatePowerUnitDto,
  ): Promise<ReadPowerUnitDto> {
    const powerUnit = await this.powerUnitsService.update(powerUnitId, updatePowerUnitDto);
    if (powerUnit)
    {
    return powerUnit
  }
    else 
    {
    throw new CustomNotFoundException("Update power unit failed. Power unit with id "+powerUnitId+" does not exist in database",HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':powerUnitId')
 async remove(@Param('powerUnitId') powerUnitId: string) {
    const deleteResult =  await this.powerUnitsService.remove(powerUnitId);
    if (deleteResult.affected >0)
      {
        return { deleted: true };
      }
      else{
        throw new CustomNotFoundException("Delete power unit failed. Power unit with id "+powerUnitId+" does not exist in database",HttpStatus.NOT_FOUND)

      }
      
  }
}
