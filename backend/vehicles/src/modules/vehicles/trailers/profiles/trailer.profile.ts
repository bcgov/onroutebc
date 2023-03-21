import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Trailer } from '../entities/trailer.entity';
import { ReadTrailerDto } from '../dto/response/read-trailer.dto';
import { UpdateTrailerDto } from '../dto/request/update-trailer.dto';
import { CreateTrailerDto } from '../dto/request/create-trailer.dto';

@Injectable()
export class TrailersProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Trailer,
        ReadTrailerDto,
        forMember(
          (d) => d.provinceCode,
          mapFrom((s) => {
            const province = s.province.provinceId.split('-');
            return province[1] === 'XX' ? null : province[1];
          }),
        ),
        forMember(
          (d) => d.countryCode,
          mapFrom((s) => {
            const province = s.province.provinceId.split('-');
            return province[0];
          }),
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
          mapFrom(
            (s) =>
              s.countryCode +
              '-' +
              (s.countryCode === 'XX' ? 'XX' : s.provinceCode),
          ),
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
          mapFrom(
            (s) =>
              s.countryCode +
              '-' +
              (s.countryCode === 'XX' ? 'XX' : s.provinceCode),
          ),
        ),
        forMember(
          (d) => d.trailerType.typeCode,
          mapFrom((s) => s.trailerTypeCode),
        ),
      );
    };
  }
}
