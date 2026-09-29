import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Trailer } from '@modules/vehicles/trailers/entities/trailer.entity';
import { ReadTrailerDto } from '@modules/vehicles/trailers/dto/response/read-trailer.dto';
import { UpdateTrailerDto } from '@modules/vehicles/trailers/dto/request/update-trailer.dto';
import { CreateTrailerDto } from '@modules/vehicles/trailers/dto/request/create-trailer.dto';
import { Province } from '@modules/common/entities/province.entity';
import { TrailerType } from '@modules/vehicles/trailer-types/entities/trailer-type.entity';
import {
  getCountryCode,
  getProvinceCode,
  getProvinceId,
} from '@common/helper/province-country.helper';

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
          mapFrom((s) => getProvinceCode(s.province.provinceId)),
        ),
        forMember(
          (d) => d.countryCode,
          mapFrom((s) => getCountryCode(s.province.provinceId)),
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
          (d) => d.createdUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.createdUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.createdUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.createdDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),

        forMember(
          (d) => d.updatedUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.updatedUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.updatedUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.updatedDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),
        forMember(
          (d) => d.province,
          mapFrom(
            (s) =>
              ({
                provinceId: getProvinceId(s.countryCode, s.provinceCode),
              }) as Province,
          ),
        ),
        forMember(
          (d) => d.trailerType,
          mapFrom(
            (s) =>
              ({
                typeCode: s.trailerTypeCode,
              }) as TrailerType,
          ),
        ),
        forMember(
          (d) => d.companyId,
          mapWithArguments((source, { companyId }) => {
            return companyId;
          }),
        ),
      );
      createMap(
        mapper,
        UpdateTrailerDto,
        Trailer,
        forMember(
          (d) => d.updatedUserGuid,
          mapWithArguments((source, { userGUID }) => {
            return userGUID;
          }),
        ),
        forMember(
          (d) => d.updatedUser,
          mapWithArguments((source, { userName }) => {
            return userName;
          }),
        ),
        forMember(
          (d) => d.updatedUserDirectory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),

        forMember(
          (d) => d.updatedDateTime,
          mapWithArguments((source, { timestamp }) => {
            return timestamp;
          }),
        ),
        forMember(
          (d) => d.province,
          mapFrom(
            (s) =>
              ({
                provinceId: getProvinceId(s.countryCode, s.provinceCode),
              }) as Province,
          ),
        ),
        forMember(
          (d) => d.trailerType,
          mapFrom(
            (s) =>
              ({
                typeCode: s.trailerTypeCode,
              }) as TrailerType,
          ),
        ),
      );
    };
  }
}
