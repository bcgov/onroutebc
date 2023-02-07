import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { ReadAddressDto } from '../dto/response/read-address.dto';
import { CreateAddressDto } from '../dto/request/create-address.dto';
import { UpdateAddressDto } from '../dto/request/update-address.dto';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Address,
        ReadAddressDto,
        forMember(
          (d) => d.provinceCode,
          mapFrom((s) => {
            const province = s.province.provinceId.split('-');
            return province[1];
          }),
        ),
        forMember(
          (d) => d.countryCode,
          mapFrom((s) => {
            const province = s.province.provinceId.split('-');
            return province[0];
          }),
        ),
      );
      createMap(
        mapper,
        CreateAddressDto,
        Address,
        forMember(
          (d) => d.province.provinceId,
          mapFrom((s) => s.countryCode + '-' + s.provinceCode),
        ),
      );
      createMap(
        mapper,
        UpdateAddressDto,
        Address,
        forMember(
          (d) => d.province.provinceId,
          mapFrom((s) => s.countryCode + '-' + s.provinceCode),
        ),
      );
    };
  }
}
