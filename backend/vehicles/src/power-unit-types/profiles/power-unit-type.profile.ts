import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { PowerUnitType } from '../entities/power-unit-type.entity';
import { PowerUnitTypeDto } from '../dto/power-unit-type.dto';
import { CreatePowerUnitTypeDto } from '../dto/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from '../dto/update-power-unit-type.dto';

@Injectable()
export class PowerUnitTypesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, PowerUnitType, PowerUnitTypeDto);
      createMap(mapper, CreatePowerUnitTypeDto, PowerUnitType);
      createMap(mapper, UpdatePowerUnitTypeDto, PowerUnitType);
    };
  }
}
