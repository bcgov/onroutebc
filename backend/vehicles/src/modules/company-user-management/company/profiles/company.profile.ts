import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
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
import { AccountRegion } from '../../../../common/enum/account-region.enum';
import { ReadCompanyMetadataDto } from '../dto/response/read-company-metadata.dto';

@Injectable()
export class CompanyProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      /**
       * The mapping between CreateCompanyDto and Company. It maps the
       * companyAddress and mailingAddress properties of CreateCompanyDto to
       * instances of the Address entity using the mapWith function. The
       * directory property is mapped to a value provided as an argument
       * to the mapping function using the mapWithArguments function.
       * TODO: Implement client number generation and change the mapping.
       * TODO: Change companyGUID mapping once the login is implemented.
       */
      createMap(
        mapper,
        CreateCompanyDto,
        Company,
        //! Below Mapping to be removed once the login is implemented.
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
          (d) => d.directory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),
        forMember(
          (d) => d.accountRegion,
          mapFrom((s) => {
            return s.companyAddress.countryCode === 'CA' &&
              s.companyAddress.provinceCode === 'BC'
              ? AccountRegion.BritishColumbia
              : AccountRegion.ExtraProvincial;
          }),
        ),
      );

      /**
       * The mapping between UpdateCompanyDto and Company. It
       * maps the companyAddress and mailingAddress properties of
       * UpdateCompanyDto to instances of the Address entity using the mapWith
       * function. It also maps the companyAddress.addressId and
       * mailingAddress.addressId properties to values provided as arguments to
       * the mapping function using the mapWithArguments function. The
       * directory and primaryContact.contactId properties are also
       * mapped to values provided as arguments using the mapWithArguments
       * function.
       */
      createMap(
        mapper,
        UpdateCompanyDto,
        Company,
        forMember(
          (d) => d.companyId,
          mapWithArguments((source, { companyId }) => {
            return companyId;
          }),
        ),
        forMember(
          (d) => d.companyAddress,
          mapWith(Address, UpdateAddressDto, (s) => s.companyAddress),
        ),
        forMember(
          (d) => d.companyAddress.addressId,
          mapWithArguments((source, { companyAddressId }) => {
            return companyAddressId;
          }),
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
          (d) => d.mailingAddress.addressId,
          mapWithArguments((source, { companyAddressId, mailingAddressId }) => {
            if (source.mailingAddressSameAsCompanyAddress) {
              return companyAddressId;
            } else {
              return mailingAddressId;
            }
          }),
        ),
        forMember(
          (d) => d.directory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),
        forMember(
          (d) => d.clientNumber,
          mapWithArguments((source, { clientNumber }) => {
            return clientNumber;
          }),
        ),
        forMember(
          (d) => d.primaryContact.contactId,
          mapWithArguments((source, { contactId }) => {
            return contactId;
          }),
        ),
        forMember(
          (d) => d.accountRegion,
          mapFrom((s) => {
            return s.companyAddress.countryCode === 'CA' &&
              s.companyAddress.provinceCode === 'BC'
              ? AccountRegion.BritishColumbia
              : AccountRegion.ExtraProvincial;
          }),
        ),
      );

      /**
       * The mapping is between Company and ReadCompanyDto. It maps the
       * companyAddress and mailingAddress properties of Company to instances of the
       * ReadAddressDto DTO using the mapWith function. The
       * mailingAddressSameAsCompanyAddress property is mapped directly using the
       * mapFrom function.
       */
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

      /**
       * The mapping is between ReadCompanyDto and ReadCompanyUserDto.
       */
      createMap(mapper, ReadCompanyDto, ReadCompanyUserDto);

      /**
       * The mapping is between Company and ReadCompanyMetadataDto.
       */
      createMap(mapper, Company, ReadCompanyMetadataDto);
    };
  }
}

/**
 * A temporary function to generate company guid for the time being.
 * TODO: Below function to be removed once login is implemented.
 * @returns A guid without '-'.
 */
const tempCompanyGuid = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const uuid: string = uuidv4() as string;
  return uuid.replace(/-/gi, '').toUpperCase();
};
