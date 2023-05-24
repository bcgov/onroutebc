import { ProvinceDto } from '../../../../src/modules/common/dto/province.dto';
import { Province } from '../../../../src/modules/common/entities/province.entity';
import { baseDtoMock, baseEntityMock } from './base.mock';
import {
  countryCADtoMock,
  countryCAEntityMock,
  countryDtoMock,
  countryEntityMock,
} from './country.mock';
import * as constants from './test-data.constants';

const PROVINCE_ID = 'CA-BC';
const PROVINCE_CODE = 'BC';
const PROVINCE_NAME = 'British Columbia';
const SORT_ORDER = '1';

export const provinceEntityMock: Province = {
  provinceId: PROVINCE_ID,
  provinceCode: PROVINCE_CODE,
  provinceName: PROVINCE_NAME,
  sortOrder: SORT_ORDER,
  country: { ...countryEntityMock },
  powerUnits: null,
  trailers: null,
  contacts: null,
  addresses: null,
  ...baseEntityMock,
};

export const provinceDtoMock: ProvinceDto = {
  provinceCode: PROVINCE_CODE,
  provinceName: PROVINCE_NAME,
  country: { ...countryDtoMock },
  ...baseDtoMock,
};

export const provinceBCEntityMock: Province = {
  provinceId: constants.PROVINCE_ID_CA_BC,
  provinceCode: constants.PROVINCE_CODE_BC,
  provinceName: constants.PROVINCE_NAME_BC,
  sortOrder: constants.SORT_ORDER_1,
  country: { ...countryCAEntityMock },
  powerUnits: null,
  trailers: null,
  contacts: null,
  addresses: null,
  ...baseEntityMock,
};

export const provinceBCDtoMock: ProvinceDto = {
  provinceCode: constants.PROVINCE_CODE_BC,
  provinceName: constants.PROVINCE_NAME_BC,
  country: { ...countryCADtoMock },
  ...baseDtoMock,
};

export const provinceWAEntityMock: Province = {
  provinceId: constants.PROVINCE_ID_US_WA,
  provinceCode: constants.PROVINCE_CODE_WA,
  provinceName: constants.PROVINCE_NAME_WA,
  sortOrder: constants.SORT_ORDER_1,
  country: { ...countryCAEntityMock },
  powerUnits: null,
  trailers: null,
  contacts: null,
  addresses: null,
  ...baseEntityMock,
};

export const provinceWADtoMock: ProvinceDto = {
  provinceCode: constants.PROVINCE_CODE_WA,
  provinceName: constants.PROVINCE_NAME_WA,
  country: { ...countryCADtoMock },
  ...baseDtoMock,
};
