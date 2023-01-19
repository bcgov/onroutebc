import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Trailer } from '../entities/trailer.entity';
import { TrailerDto } from '../dto/trailer.dto';
import { UpdateTrailerDto } from '../dto/update-trailer.dto';
import { CreateTrailerDto } from '../dto/create-trailer.dto';

@Injectable()
export class TrailersProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Trailer,
        TrailerDto,
        forMember(
          (d) => d.provinceId,
          mapFrom((s) => s.province.provinceId),
        ),
        forMember(
          (d) => d.trailerTypeCode,
          mapFrom((s) => s.trailerType.typeCode),
        ),
      );
      createMap(
        mapper,
        CreateTrailerDto,
        Trailer,
        forMember(
          (d) => d.province.provinceId,
          mapFrom((s) => s.provinceId),
        ),
        forMember(
          (d) => d.trailerType.typeCode,
          mapFrom((s) => s.trailerTypeCode),
        ),
      );
      createMap(
        mapper,
        UpdateTrailerDto,
        Trailer,
        forMember(
          (d) => d.province.provinceId,
          mapFrom((s) => s.provinceId),
        ),
        forMember(
          (d) => d.trailerType.typeCode,
          mapFrom((s) => s.trailerTypeCode),
        ),
      );
    };
  }
}
