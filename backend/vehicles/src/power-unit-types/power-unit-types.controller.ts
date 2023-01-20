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
import { CreatePowerUnitTypeDto } from './dto/request/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from './dto/request/update-power-unit-type.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomNotFoundException } from 'src/common/exception/custom.notfound.exception';
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
  async findAll():Promise<ReadPowerUnitTypeDto[]>  {
    return await this.powerUnitTypesService.findAll();
  }
  

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: ReadPowerUnitTypeDto,
  })
  @Get(':typeCode')
  async findOne(@Param('typeCode') typeCode: string):Promise<ReadPowerUnitTypeDto> {
    const powerUnitType = await this.powerUnitTypesService.findOne(typeCode);
    if (powerUnitType)
   {
    return powerUnitType;
   }else{
    throw new CustomNotFoundException("Data not found",HttpStatus.NOT_FOUND)
   }
  }

  @ApiOkResponse({
    description: 'The Power Unit Type Resource',
    type: ReadPowerUnitTypeDto,
  })
  @Put(':typeCode')
  async update(
    @Param('typeCode') typeCode: string,
    @Body() updatePowerUnitTypeDto: UpdatePowerUnitTypeDto,
  ): Promise<ReadPowerUnitTypeDto> {
    const powerUnitType = await this.powerUnitTypesService.update(typeCode, updatePowerUnitTypeDto);
    if (powerUnitType)
    {
    return powerUnitType
  }
    else 
    {
    throw new CustomNotFoundException("Data not found",HttpStatus.NOT_FOUND)
    }
  }

  @Delete(':typeCode')
  async remove(@Param('typeCode') typeCode: string) {
    const deleteResult = await this.powerUnitTypesService.remove(typeCode);
    if(deleteResult.affected >0)
    {
      return { deleted: true };
    }else{
      throw new CustomNotFoundException("Data not found",HttpStatus.NOT_FOUND)

    }
  }
}
