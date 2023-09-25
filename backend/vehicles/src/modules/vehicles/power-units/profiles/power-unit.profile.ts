import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ReadPowerUnitDto } from '../dto/response/read-power-unit.dto';
import { PowerUnit } from '../entities/power-unit.entity';
import { CreatePowerUnitDto } from '../dto/request/create-power-unit.dto';
import { UpdatePowerUnitDto } from '../dto/request/update-power-unit.dto';
import {
  getCountryCode,
  getProvinceCode,
  getProvinceId,
} from '../../../../common/helper/province-country.helper';

@Injectable()
export class PowerUnitsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        PowerUnit,
        ReadPowerUnitDto,
        forMember(
          (d) => d.provinceCode,
          mapFrom((s) => getProvinceCode(s.province.provinceId)),
        ),
        forMember(
          (d) => d.countryCode,
          mapFrom((s) => getCountryCode(s.province.provinceId)),
        ),
        forMember(
          (d) => d.powerUnitTypeCode,
          mapFrom((s) => s.powerUnitType.typeCode),
        ),
      );
      createMap(
        mapper,
        CreatePowerUnitDto,
        PowerUnit,
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
          (d) => d.upatedUserGuid,
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
          (d) => d.province.provinceId,
          mapFrom((s) => getProvinceId(s.countryCode, s.provinceCode)),
        ),
        forMember(
          (d) => d.powerUnitType.typeCode,
          mapFrom((s) => s.powerUnitTypeCode),
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
        UpdatePowerUnitDto,
        PowerUnit,
        forMember(
          (d) => d.upatedUserGuid,
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
          (d) => d.province.provinceId,
          mapFrom((s) => getProvinceId(s.countryCode, s.provinceCode)),
        ),
        forMember(
          (d) => d.powerUnitType.typeCode,
          mapFrom((s) => s.powerUnitTypeCode),
        ),
      );
    };
  }
}
