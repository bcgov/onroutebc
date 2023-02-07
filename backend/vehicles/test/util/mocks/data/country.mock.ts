import { CountryDto } from '../../../../src/modules/common/dto/country.dto';
import { Country } from '../../../../src/modules/common/entities/country.entity';
import { baseDtoMock, baseEntityMock } from './base.mock';

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
