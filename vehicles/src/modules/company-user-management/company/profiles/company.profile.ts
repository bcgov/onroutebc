import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWith,
  mapWithArguments,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Company } from '../entities/company.entity';

import { CreateAddressDto } from '../../../common/dto/request/create-address.dto';
import { Address } from '../../../common/entities/address.entity';
import { ReadAddressDto } from '../../../common/dto/response/read-address.dto';
import { UpdateAddressDto } from '../../../common/dto/request/update-address.dto';
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
       * mailingAddress property of CreateCompanyDto to instances of the Address
       * entity using the mapWith function. The directory property is mapped to
       * a value provided as an argument to the mapping function using the
       * mapWithArguments function.
       */
      createMap(
        mapper,
        CreateCompanyDto,
        Company,
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
          (d) => d.companyGUID,
          mapWithArguments((source, { companyGUID }) => {
            return companyGUID;
          }),
        ),
        forMember(
          (d) => d.directory,
          mapWithArguments((source, { directory }) => {
            return directory;
          }),
        ),
        forMember(
          (d) => d.accountSource,
          mapWithArguments((source, { accountSource }) => {
            return accountSource;
          }),
        ),
        forMember(
          (d) => d.mailingAddress,
          mapWith(Address, CreateAddressDto, (s) => {
            return s.mailingAddress;
          }),
        ),
        forMember(
          (d) => d.accountRegion,
          mapFrom((s) => {
            return s.mailingAddress.countryCode === 'CA' &&
              s.mailingAddress.provinceCode === 'BC'
              ? AccountRegion.BritishColumbia
              : AccountRegion.ExtraProvincial;
          }),
        ),
      );

      /**
       * The mapping between UpdateCompanyDto and Company. It maps the
       * mailingAddress property of UpdateCompanyDto to instances of the Address
       * entity using the mapWith function. It also maps the
       * mailingAddress.addressId property to values provided as arguments to
       * the mapping function using the mapWithArguments function. The directory
       * and primaryContact.contactId properties are also mapped to values
       * provided as arguments using the mapWithArguments function.
       */
      createMap(
        mapper,
        UpdateCompanyDto,
        Company,
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
          (d) => d.companyId,
          mapWithArguments((source, { companyId }) => {
            return companyId;
          }),
        ),
        forMember(
          (d) => d.mailingAddress,
          mapWith(Address, UpdateAddressDto, (s) => {
            return s.mailingAddress;
          }),
        ),
        forMember(
          (d) => d.mailingAddress.addressId,
          mapWithArguments((source, { mailingAddressId }) => {
            return mailingAddressId;
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
            return s.mailingAddress.countryCode === 'CA' &&
              s.mailingAddress.provinceCode === 'BC'
              ? AccountRegion.BritishColumbia
              : AccountRegion.ExtraProvincial;
          }),
        ),
      );

      /**
       * The mapping is between Company and ReadCompanyDto. It maps the
       * mailingAddress property of Company to instances of the ReadAddressDto
       * DTO using the mapWith function. The mapping is between Company and
       * ReadCompanyDto.
       */
      createMap(
        mapper,
        Company,
        ReadCompanyDto,
        forMember(
          (d) => d.mailingAddress,
          mapWith(ReadAddressDto, Address, (s) => s.mailingAddress),
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
