import { CountryDto } from '../../../../src/modules/common/dto/country.dto';
import { Country } from '../../../../src/modules/common/entities/country.entity';
import { baseDtoMock, baseEntityMock } from './base.mock';
import * as constants from './test-data.constants';

const COUNTRY_CODE = 'CA';
const COUNTRY_NAME = 'CANADA';
const SORT_ORDER = '1';

export const countryEntityMock: Country = {
  countryCode: COUNTRY_CODE,
  countryName: COUNTRY_NAME,
  sortOrder: SORT_ORDER,
  provinces: null,
  ...baseEntityMock,
};

export const countryDtoMock: CountryDto = {
  countryCode: COUNTRY_CODE,
  countryName: COUNTRY_NAME,
  ...baseDtoMock,
};

export const countryCAEntityMock: Country = {
  countryCode: constants.COUNTRY_CODE_CA,
  countryName: constants.COUNTRY_NAME_CA,
  sortOrder: constants.SORT_ORDER_1,
  provinces: null,
  ...baseEntityMock,
};

export const countryCADtoMock: CountryDto = {
  countryCode: constants.COUNTRY_CODE_CA,
  countryName: constants.COUNTRY_NAME_CA,
  ...baseDtoMock,
};

export const countryUSEntityMock: Country = {
  countryCode: constants.COUNTRY_CODE_US,
  countryName: constants.COUNTRY_NAME_US,
  sortOrder: constants.SORT_ORDER_2,
  provinces: null,
  ...baseEntityMock,
};

export const countryUSDtoMock: CountryDto = {
  countryCode: constants.COUNTRY_CODE_US,
  countryName: constants.COUNTRY_NAME_US,
  ...baseDtoMock,
};
