import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { PowerUnitType } from '../entities/power-unit-type.entity';
import { ReadPowerUnitTypeDto } from '../dto/response/read-power-unit-type.dto';
import { CreatePowerUnitTypeDto } from '../dto/request/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from '../dto/request/update-power-unit-type.dto';

@Injectable()
export class PowerUnitTypesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, PowerUnitType, ReadPowerUnitTypeDto);
      createMap(mapper, CreatePowerUnitTypeDto, PowerUnitType);
      createMap(mapper, UpdatePowerUnitTypeDto, PowerUnitType);
    };
  }
}
