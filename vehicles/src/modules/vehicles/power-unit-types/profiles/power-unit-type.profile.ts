import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { PowerUnitType } from '@modules/vehicles/power-unit-types/entities/power-unit-type.entity';
import { ReadPowerUnitTypeDto } from '@modules/vehicles/power-unit-types/dto/response/read-power-unit-type.dto';
import { CreatePowerUnitTypeDto } from '@modules/vehicles/power-unit-types/dto/request/create-power-unit-type.dto';
import { UpdatePowerUnitTypeDto } from '@modules/vehicles/power-unit-types/dto/request/update-power-unit-type.dto';

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
