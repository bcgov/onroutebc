import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  fromValue,
  mapFrom,
  Mapper,
  mapWith,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Company } from '../entities/company.entity';
import { CreateCompanyProfileDto } from '../dto/request/create-company-profile.dto';
import { CreateAddressDto } from '../../../common/dto/request/create-address.dto';
import { Address } from '../../../common/entities/address.entity';
import { UpdateCompanyProfileDto } from '../dto/request/update-company-profile.dto';
import { ReadCompanyProfileDto } from '../dto/response/read-company-profile.dto';
import { ReadAddressDto } from '../../../common/dto/response/read-address.dto';
import { UpdateAddressDto } from '../../../common/dto/request/update-address.dto';

@Injectable()
export class CompanyProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreateCompanyProfileDto,
        Company,
        forMember(
          (d) => d.companyAddress,
          mapWith(Address, CreateAddressDto, (s) => s.companyAddress),
        ),
        forMember(
          (d) => d.mailingAddress,
          mapWith(Address, CreateAddressDto, (s) => {
            if (s.mailingAddressSameAsCompanyAddress) {
              return s.companyAddress;
            } else {
              return s.mailingAddress;
            }
          }),
        ),
        forMember((d) => d.companyDirectory, fromValue('bbceid')),
      );
      createMap(
        mapper,
        UpdateCompanyProfileDto,
        Company,
        forMember(
          (d) => d.companyAddress,
          mapWith(Address, UpdateAddressDto, (s) => s.companyAddress),
        ),
        forMember(
          (d) => d.mailingAddress,
          mapWith(Address, UpdateAddressDto, (s) => {
            if (s.mailingAddressSameAsCompanyAddress) {
              return s.companyAddress;
            } else {
              return s.mailingAddress;
            }
          }),
        ),
        forMember((d) => d.companyDirectory, fromValue('bbceid')),
      );

      createMap(
        mapper,
        Company,
        ReadCompanyProfileDto,
        forMember(
          (d) => d.companyAddress,
          mapWith(ReadAddressDto, Address, (s) => s.companyAddress),
        ),
        forMember(
          (d) => d.mailingAddress,
          mapWith(ReadAddressDto, Address, (s) => s.mailingAddress),
        ),
        forMember(
          (d) => d.mailingAddressSameAsCompanyAddress,
          mapFrom((s) => s.mailingAddressSameAsCompanyAddress),
        ),
      );
    };
  }
}
