import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { TrailerType } from '../entities/trailer-type.entity';
import { ReadTrailerTypeDto } from '../dto/response/read-trailer-type.dto';
import { CreateTrailerTypeDto } from '../dto/request/create-trailer-type.dto';
import { UpdateTrailerTypeDto } from '../dto/request/update-trailer-type.dto';

@Injectable()
export class TrailerTypesProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, TrailerType, ReadTrailerTypeDto);
      createMap(mapper, CreateTrailerTypeDto, TrailerType);
      createMap(mapper, UpdateTrailerTypeDto, TrailerType);
    };
  }
}
