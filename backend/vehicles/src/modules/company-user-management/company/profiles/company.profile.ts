/* eslint-disable @typescript-eslint/no-unsafe-call */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  ignore,
  mapFrom,
  Mapper,
  mapWith,
  mapWithArguments,
  preCondition,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Company } from '../entities/company.entity';

import { CreateAddressDto } from '../../../common/dto/request/create-address.dto';
import { Address } from '../../../common/entities/address.entity';

import { ReadAddressDto } from '../../../common/dto/response/read-address.dto';
import { UpdateAddressDto } from '../../../common/dto/request/update-address.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateCompanyDto } from '../dto/request/create-company.dto';
import { UpdateCompanyDto } from '../dto/request/update-company.dto';
import { ReadCompanyDto } from '../dto/response/read-company.dto';
import { ReadCompanyUserDto } from '../dto/response/read-company-user.dto';

@Injectable()
export class CompanyProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreateCompanyDto,
        Company,
        //TODO : Below Mapping to be removed once login has been implmented
        forMember(
          (d) => d.clientNumber,
          mapFrom(() => {
            return tempClientNumber();
          }),
        ),
        //TODO : Below Mapping to be removed once login has been implmented
        forMember(
          (d) => d.companyGUID,
          mapFrom(() => {
            return tempCompanyGuid();
          }),
        ),
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
        forMember(
          (d) => d.companyDirectory,
          mapWithArguments((source, { companyDirectory }) => {
            return companyDirectory;
          }),
        ),
      );
      createMap(
        mapper,
        UpdateCompanyDto,
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
        forMember(
          (d) => d.companyDirectory,
          mapWithArguments((source, { companyDirectory }) => {
            return companyDirectory;
          }),
        ),
      );

      createMap(
        mapper,
        Company,
        ReadCompanyDto,
        forMember(
          (d) => d.companyAddress,
          mapWith(ReadAddressDto, Address, (s) => s.companyAddress),
        ),
        forMember(
          (d) => d.mailingAddress,
          preCondition((s) => !s.mailingAddressSameAsCompanyAddress),
          mapWith(ReadAddressDto, Address, (s) => s.mailingAddress),
        ),
        forMember(
          (d) => d.mailingAddressSameAsCompanyAddress,
          mapFrom((s) => s.mailingAddressSameAsCompanyAddress),
        ),
      );

      createMap(
        mapper,
        Company,
        ReadCompanyUserDto,
        forMember(
          (d) => d.companyAddress,
          mapWith(ReadAddressDto, Address, (s) => s.companyAddress),
        ),
        forMember(
          (d) => d.mailingAddress,
          preCondition((s) => !s.mailingAddressSameAsCompanyAddress),
          mapWith(ReadAddressDto, Address, (s) => s.mailingAddress),
        ),
        forMember(
          (d) => d.mailingAddressSameAsCompanyAddress,
          mapFrom((s) => s.mailingAddressSameAsCompanyAddress),
        ),
        forMember((d) => d.adminUser, ignore()),
      );
    };
  }
}

//TODO : Below Code to be removed once login has been implmented
const tempClientNumber = () => {
  return Math.floor(Math.random() * 1000000000).toString();
};

//TODO : Below Code to be removed once login has been implmented
const tempCompanyGuid = () => {
  const uuid: string = uuidv4() as string;
  return uuid.replace(/-/gi, '').toUpperCase();
};
