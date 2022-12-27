import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreatePowerUnitDto } from './dto/create-powerUnit.dto';
import { UpdatePowerUnitDto } from './dto/update-PowerUnit.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehcilesService: VehiclesService) {}

  @Post('/powerUnit')
  create(@Body() createPowerUnitDto: CreatePowerUnitDto) {
    return this.vehcilesService.create(createPowerUnitDto);
  }

  @Get('/powerUnit')
  findAll() {
    return this.vehcilesService.findAll();
  }

  @Get('/powerUnit/:powerUnitId')
  findOne(@Param('powerUnitId') powerUnitId: string) {
    return this.vehcilesService.findOne(powerUnitId);
  }

  @Put('/powerUnit/:powerUnitId')
  update(
    @Param('powerUnitId') powerUnitId: string,
    @Body() updateUserDto: UpdatePowerUnitDto,
  ) {
    return this.vehcilesService.update(powerUnitId, updateUserDto);
  }

  @Delete('/powerUnit/:powerUnitId')
  remove(@Param('powerUnitId') powerUnitId: string) {
    return this.vehcilesService.remove(powerUnitId);
  }
}
