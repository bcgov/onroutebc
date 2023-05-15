import { baseEntityMock } from './base.mock';
import { Company } from '../../../../src/modules/company-user-management/company/entities/company.entity';
import {
  addressEntityMock,
  createAddressDtoMock,
  readAddressDtoMock,
  updateAddressDtoMock,
} from './address.mock';
import {
  contactEntityMock,
  createContactDtoMock,
  readContactDtoMock,
  updateContactDtoMock,
} from './contact.mock';
import { AccountRegion } from '../../../../src/common/enum/account-region.enum';
import { AccountSource } from '../../../../src/common/enum/account-source.enum';
import { Directory } from '../../../../src/common/enum/directory.enum';
import { companyUserEntityMock } from './company-user.mock';
import { createUserDtoMock, readUserDtoMock } from './user.mock';
import { CreateCompanyDto } from '../../../../src/modules/company-user-management/company/dto/request/create-company.dto';
import { UpdateCompanyDto } from '../../../../src/modules/company-user-management/company/dto/request/update-company.dto';
import { ReadCompanyDto } from '../../../../src/modules/company-user-management/company/dto/response/read-company.dto';
import { ReadCompanyUserDto } from '../../../../src/modules/company-user-management/company/dto/response/read-company-user.dto';
import { ReadCompanyMetadataDto } from '../../../../src/modules/company-user-management/company/dto/response/read-company-metadata.dto';

const COMPANY_ID = 1;
const COMPANY_GUID = '6F9619FF8B86D011B42D00C04FC964FF';
const CLIENT_NUMBER = 'ABC Carriers Inc.';
const LEGAL_NAME = 'B3-000005-722';
const DIRECOTRY = Directory.BBCEID;
const PHONE_1 = '9999999999';
const PHONE_1_EXT = '99999';
const FAX = '9999999999';
const EMAIL = 'test@test.gov.bc.ca';
const ACCOUNT_REGION = AccountRegion.BritishColumbia;
const ACCOUNT_SOURCE = AccountSource.BCeID;

export const companyEntityMock: Company = {
  companyId: COMPANY_ID,
  companyGUID: COMPANY_GUID,
  clientNumber: CLIENT_NUMBER,
  legalName: LEGAL_NAME,
  directory: DIRECOTRY,
  mailingAddress: { ...addressEntityMock },
  phone: PHONE_1,
  extension: PHONE_1_EXT,
  fax: FAX,
  email: EMAIL,
  primaryContact: { ...contactEntityMock },
  accountRegion: ACCOUNT_REGION,
  accountSource: ACCOUNT_SOURCE,
  companyUsers: [{ ...companyUserEntityMock }],
  ...baseEntityMock,
};

export const createCompanyDtoMock: CreateCompanyDto = {
  legalName: LEGAL_NAME,
  mailingAddress: { ...createAddressDtoMock },
  phone: PHONE_1,
  extension: PHONE_1_EXT,
  fax: FAX,
  email: EMAIL,
  primaryContact: { ...createContactDtoMock },
  adminUser: { ...createUserDtoMock },
};

export const updateCompanyDtoMock: UpdateCompanyDto = {
  legalName: LEGAL_NAME,
  mailingAddress: { ...updateAddressDtoMock },
  phone: PHONE_1,
  extension: PHONE_1_EXT,
  fax: FAX,
  email: EMAIL,
  primaryContact: { ...updateContactDtoMock },
};

export const readCompanyDtoMock: ReadCompanyDto = {
  companyId: COMPANY_ID,
  companyGUID: COMPANY_GUID,
  legalName: LEGAL_NAME,
  clientNumber: CLIENT_NUMBER,
  mailingAddress: { ...readAddressDtoMock },
  phone: PHONE_1,
  extension: PHONE_1_EXT,
  fax: FAX,
  email: EMAIL,
  primaryContact: { ...readContactDtoMock },
};

export const readCompanyUserDtoMock: ReadCompanyUserDto = {
  adminUser: { ...readUserDtoMock },
  ...readCompanyDtoMock,
};

export const readCompanyMetadataDtoMock: ReadCompanyMetadataDto = {
  companyId: COMPANY_ID,
  legalName: LEGAL_NAME,
  clientNumber: CLIENT_NUMBER,
};
