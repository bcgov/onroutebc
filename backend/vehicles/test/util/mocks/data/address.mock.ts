import { provinceEntityMock } from './province.mock';
import { baseEntityMock } from './base.mock';
import { Address } from '../../../../src/modules/common/entities/address.entity';
import { CreateAddressDto } from '../../../../src/modules/common/dto/request/create-address.dto';
import { UpdateAddressDto } from '../../../../src/modules/common/dto/request/update-address.dto';
import { ReadAddressDto } from '../../../../src/modules/common/dto/response/read-address.dto';

const ADDRESS_ID = 1;
const ADDRESS_LINE_1 = '49 George St';
const ADDRESS_LINE_2 = 'Unit 223';
const POSTAL_CODE = 'V65 4N5';
const CITY = 'Vancouver';
const PROVINCE_CODE = 'BC';
const COUNTRY_CODE = 'CA';

export const addressEntityMock: Address = {
  addressId: ADDRESS_ID,
  addressLine1: ADDRESS_LINE_1,
  addressLine2: ADDRESS_LINE_2,
  city: CITY,
  province: { ...provinceEntityMock },
  postalCode: POSTAL_CODE,
  company: null,
  ...baseEntityMock,
};

export const createAddressDtoMock: CreateAddressDto = {
  addressLine1: ADDRESS_LINE_1,
  addressLine2: ADDRESS_LINE_2,
  city: CITY,
  provinceCode: PROVINCE_CODE,
  countryCode: COUNTRY_CODE,
  postalCode: POSTAL_CODE,
};

export const updateAddressDtoMock: UpdateAddressDto = {
  ...createAddressDtoMock,
  addressLine1: '1 Victoria St',
};

export const readAddressDtoMock: ReadAddressDto = {
  ...createAddressDtoMock,
};
