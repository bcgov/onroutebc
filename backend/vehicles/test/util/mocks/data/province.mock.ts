import { ProvinceDto } from '../../../../src/common/dto/province.dto';
import { Province } from '../../../../src/common/entities/province.entity';
import { baseDtoMock, baseEntityMock } from './base.mock';
import { countryDtoMock, countryEntityMock } from './country.mock';

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
