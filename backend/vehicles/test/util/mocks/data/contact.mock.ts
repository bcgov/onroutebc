import { provinceEntityMock } from './province.mock';
import { Contact } from '../../../../src/modules/common/entities/contact.entity';
import { CreateContactDto } from '../../../../src/modules/common/dto/request/create-contact.dto';
import { UpdateContactDto } from '../../../../src/modules/common/dto/request/update-contact.dto';
import { ReadContactDto } from '../../../../src/modules/common/dto/response/read-contact.dto';
import { baseEntityMock } from './base.mock';

const CONTACT_ID = 1;
const FIRST_NAME = 'Adam';
const LAST_NAME = 'Smith';
const PHONE_1 = '9999999999';
const PHONE_1_EXT = '99999';
const PHONE_2 = '9999999999';
const PHONE_2_EXT = '99999';
const FAX = '9999999999';
const EMAIL = 'test@test.gov.bc.ca';
const CITY = 'Vancouver';
const PROVINCE_CODE = 'BC';
const COUNTRY_CODE = 'CA';

export const contactEntityMock: Contact = {
  contactId: CONTACT_ID,
  firstName: FIRST_NAME,
  lastName: LAST_NAME,
  email: EMAIL,
  phone1: PHONE_1,
  extension1: PHONE_1_EXT,
  phone2: PHONE_2,
  extension2: PHONE_2_EXT,
  fax: FAX,
  city: CITY,
  province: { ...provinceEntityMock },
  company: null,
  user: null,
  ...baseEntityMock,
};

export const createContactDtoMock: CreateContactDto = {
  firstName: FIRST_NAME,
  lastName: LAST_NAME,
  email: EMAIL,
  phone1: PHONE_1,
  phone1Extension: PHONE_1_EXT,
  phone2: PHONE_2,
  phone2Extension: PHONE_2_EXT,
  fax: FAX,
  city: CITY,
  provinceCode: PROVINCE_CODE,
  countryCode: COUNTRY_CODE,
};

export const updateContactDtoMock: UpdateContactDto = {
  ...createContactDtoMock,
  firstName: 'JOHN',
};

export const readContactDtoMock: ReadContactDto = {
  ...createContactDtoMock,
};
