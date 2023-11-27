import { provinceBCEntityMock, provinceWAEntityMock } from './province.mock';
import { baseEntityMock } from './base.mock';
import { Address } from '../../../../src/modules/common/entities/address.entity';
import { CreateAddressDto } from '../../../../src/modules/common/dto/request/create-address.dto';
import { UpdateAddressDto } from '../../../../src/modules/common/dto/request/update-address.dto';
import { ReadAddressDto } from '../../../../src/modules/common/dto/response/read-address.dto';
import * as constants from './test-data.constants';

export const redCompanyAddressEntityMock: Address = {
  addressId: constants.RED_COMPANY_ADDRESS_ID,
  addressLine1: constants.RED_COMPANY_ADDRESS_LINE_1,
  addressLine2: constants.RED_COMPANY_ADDRESS_LINE_2,
  city: constants.RED_COMPANY_ADDRESS_CITY,
  province: { ...provinceBCEntityMock },
  postalCode: constants.RED_COMPANY_ADDRESS_POSTAL,
  company: null,
  ...baseEntityMock,
};

export const createRedCompanyAddressDtoMock: CreateAddressDto = {
  addressLine1: constants.RED_COMPANY_ADDRESS_LINE_1,
  addressLine2: constants.RED_COMPANY_ADDRESS_LINE_2,
  city: constants.RED_COMPANY_ADDRESS_CITY,
  provinceCode: constants.RED_COMPANY_PROVINCE_CODE,
  countryCode: constants.RED_COMPANY_COUNTRY_CODE,
  postalCode: constants.RED_COMPANY_ADDRESS_POSTAL,
};

export const updateRedCompanyAddressDtoMock: UpdateAddressDto = {
  ...createRedCompanyAddressDtoMock,
  addressLine2: 'Unit 146',
};

export const readRedCompanyAddressDtoMock: ReadAddressDto = {
  ...createRedCompanyAddressDtoMock,
};

export const blueCompanyAddressEntityMock: Address = {
  addressId: constants.BLUE_COMPANY_ADDRESS_ID,
  addressLine1: constants.BLUE_COMPANY_ADDRESS_LINE_1,
  addressLine2: constants.BLUE_COMPANY_ADDRESS_LINE_2,
  city: constants.BLUE_COMPANY_ADDRESS_CITY,
  province: { ...provinceWAEntityMock },
  postalCode: constants.BLUE_COMPANY_ADDRESS_POSTAL,
  company: null,
  ...baseEntityMock,
};

export const createBlueCompanyAddressDtoMock: CreateAddressDto = {
  addressLine1: constants.RED_COMPANY_ADDRESS_LINE_1,
  addressLine2: constants.RED_COMPANY_ADDRESS_LINE_2,
  city: constants.RED_COMPANY_ADDRESS_CITY,
  provinceCode: constants.BLUE_COMPANY_PROVINCE_CODE,
  countryCode: constants.BLUE_COMPANY_COUNTRY_CODE,
  postalCode: constants.RED_COMPANY_ADDRESS_POSTAL,
};

export const updateBlueCompanyAddressDtoMock: UpdateAddressDto = {
  ...createBlueCompanyAddressDtoMock,
  addressLine2: 'Unit 221',
};

export const readBlueCompanyAddressDtoMock: ReadAddressDto = {
  ...createBlueCompanyAddressDtoMock,
};
