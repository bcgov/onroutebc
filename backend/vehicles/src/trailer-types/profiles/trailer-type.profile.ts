import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { TrailerType } from '../entities/trailer-type.entity';
import { TrailerTypeDto } from '../dto/trailer-type.dto';
import { CreateTrailerTypeDto } from '../dto/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from '../dto/update-trailer-type.dto';

@Injectable()
export class TrailerTypesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, TrailerType, TrailerTypeDto);
      createMap(mapper, CreateTrailerTypeDto, TrailerType);
      createMap(mapper, UpdateTrailerTypeDto, TrailerType);
    };
  }
}
