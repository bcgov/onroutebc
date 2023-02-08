/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import { v4 as uuidv4 } from 'uuid';

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
        //TODO : Below Mapping to be removed once login has been implmented
        forMember((d) => d.clientNumber, fromValue(tempClientNumber())),
        //TODO : Below Mapping to be removed once login has been implmented
        forMember((d) => d.companyGUID, fromValue(tempCompanyGuid())),
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
        forMember((d) => d.companyDirectory, fromValue('BBCEID')),
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
        forMember((d) => d.companyDirectory, fromValue('BBCEID')),
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

//TODO : Below Code to be removed once login has been implmented
const tempClientNumber = () => {
  return Math.floor(Math.random() * 1000000000).toString();
};

//TODO : Below Code to be removed once login has been implmented
const tempCompanyGuid = () => {
  const uuid: string = uuidv4() as string;
  return uuid.replace(/-/gi, '').toUpperCase();
};
