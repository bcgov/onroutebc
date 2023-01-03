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
import { CreateTrailerDto } from './dto/create-trailer.dto';
import { UpdateTrailerDto } from './dto/update-Trailer.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehcilesService: VehiclesService) {}

  @Post('/powerUnit')
  createPowerUnit(@Body() createPowerUnitDto: CreatePowerUnitDto) {
    return this.vehcilesService.createPowerUnit(createPowerUnitDto);
  }

  @Post('/trailer')
  createTrailer(@Body() createTrailerDto: CreateTrailerDto) {
    return this.vehcilesService.createTrailer(createTrailerDto);
  }

  @Get('/powerUnit')
  findAllPowerUnit() {
    return this.vehcilesService.findAllPowerUnit();
  }

  @Get('/trailer')
  findAllTrailer() {
    return this.vehcilesService.findAlltrailer();
  }

  @Get('/powerUnit/:powerUnitId')
  findOnePowerUnit(@Param('powerUnitId') powerUnitId: string) {
    return this.vehcilesService.findOnePowerUnit(powerUnitId);
  }

  @Get('/trailer/:trailerId')
  findOneTrailer(@Param('trailerId') trailerId: string) {
    return this.vehcilesService.findOneTrailer(trailerId);
  }

  @Put('/powerUnit/:powerUnitId')
  updatePowerUnit(
    @Param('powerUnitId') powerUnitId: string,
    @Body() updatePowerUnitDto: UpdatePowerUnitDto,
  ) {
    return this.vehcilesService.updatePowerUnit(
      powerUnitId,
      updatePowerUnitDto,
    );
  }

  @Put('/trailer/:trailerId')
  updateTrailer(
    @Param('trailerId') trailerId: string,
    @Body() updateTrailerDto: UpdateTrailerDto,
  ) {
    return this.vehcilesService.updateTrailer(trailerId, updateTrailerDto);
  }

  @Delete('/powerUnit/:powerUnitId')
  removePowerUnit(@Param('powerUnitId') powerUnitId: string) {
    return this.vehcilesService.removePowerUnit(powerUnitId);
  }

  @Delete('/trailer/:trailerId')
  removetrailer(@Param('trailerId') trailerId: string) {
    return this.vehcilesService.removeTrailer(trailerId);
  }
}
