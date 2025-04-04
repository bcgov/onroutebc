import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { CreateContactDto } from '../dto/request/create-contact.dto';
import { UpdateContactDto } from '../dto/request/update-contact.dto';
import { ReadContactDto } from '../dto/response/read-contact.dto';
import { Contact } from '../entities/contact.entity';
import {
  getCountryCode,
  getProvinceCode,
  getProvinceId,
} from '../../../common/helper/province-country.helper';

@Injectable()
export class ContactProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      /**
       * The mapping between Contact Entity and ReadContactDto DTO.It defines
       * two custom mappings using the forMember() function that map the
       * provinceCode and countryCode properties of the DTO based on the
       * province.provinceId property of the entity. Additionally, it maps the
       * extension1 and extension2 properties of the entity to the
       * phone1Extension and phone2Extension properties of the DTO,
       * respectively.
       */
      createMap(
        mapper,
        Contact,
        ReadContactDto,
        forMember(
          (d) => d.provinceCode,
          mapFrom((s) => getProvinceCode(s.province.provinceId)),
        ),
        forMember(
          (d) => d.countryCode,
          mapFrom((s) => getCountryCode(s.province.provinceId)),
        ),
        forMember(
          (d) => d.phone1Extension,
          mapFrom((s) => s.extension1),
        ),
        forMember(
          (d) => d.phone2Extension,
          mapFrom((s) => s.extension2),
        ),
      );

      /**
       * The mapping between CreateContactDto DTO and Contact Entity.The mapping
       * uses the forMember() function to map the province.provinceId property
       * of the entity based on the countryCode and provinceCode properties of
       * the DTO, and to map the extension1 and extension2 properties of the DTO
       * to the phone1Extension and phone2Extension properties of the entity,
       * respectively.
       */
      createMap(
        mapper,
        CreateContactDto,
        Contact,
        forMember(
          (d) => d.province.provinceId,
          mapFrom((s) => getProvinceId(s.countryCode, s.provinceCode)),
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

      /**
       * The mapping between UpdateContactDto DTO and Contact Entity.The mapping
       * uses the forMember() function to map the province.provinceId property
       * of the entity based on the countryCode and provinceCode properties of
       * the DTO, and to map the extension1 and extension2 properties of the DTO
       * to the phone1Extension and phone2Extension properties of the entity,
       * respectively.
       */
      createMap(
        mapper,
        UpdateContactDto,
        Contact,
        forMember(
          (d) => d.province.provinceId,
          mapFrom((s) => getProvinceId(s.countryCode, s.provinceCode)),
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
