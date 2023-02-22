import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { CreateContactDto } from '../dto/request/create-contact.dto';
import { UpdateContactDto } from '../dto/request/update-contact.dto';
import { ReadContactDto } from '../dto/response/read-contact.dto';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class ContactProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Contact,
        ReadContactDto,
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
        forMember(
          (d) => d.phone1Extension,
          mapFrom((s) => s.extension1),
        ),
        forMember(
          (d) => d.phone2Extension,
          mapFrom((s) => s.extension1),
        ),
      );
      createMap(
        mapper,
        CreateContactDto,
        Contact,
        forMember(
          (d) => d.province.provinceId,
          mapFrom((s) => s.countryCode + '-' + s.provinceCode),
        ),
        forMember(
          (d) => d.extension1,
          mapFrom((s) => s.phone1Extension),
        ),
        forMember(
          (d) => d.extension2,
          mapFrom((s) => s.phone2Extension),
        ),
      );
      createMap(
        mapper,
        UpdateContactDto,
        Contact,
        forMember(
          (d) => d.province.provinceId,
          mapFrom((s) => s.countryCode + '-' + s.provinceCode),
        ),
        forMember(
          (d) => d.extension1,
          mapFrom((s) => s.phone1Extension),
        ),
        forMember(
          (d) => d.extension2,
          mapFrom((s) => s.phone2Extension),
        ),
      );
    };
  }
}
