import { Country } from 'src/modules/common/entities/country.entity';
import { Province } from 'src/modules/common/entities/province.entity';
import { Repository } from 'typeorm';

/**
 * Converts CountryCode to Country Name using the ORBC_VT_COUNTRY table
 * @param countryCode
 * @param countryRepository
 * @returns Full name of the country
 */
export const formatCountry = async (
  countryCode: string,
  countryRepository: Repository<Country>,
) => {
  const countryName = await countryRepository.findOne({
    where: { countryCode: countryCode },
  });
  // TODO: Cache this ^ data
  return countryName.countryName;
};

/**
 * Converts provinceCode to Province Name using the ORBC_VT_PROVINCE table
 * @param provinceCode
 * @param provinceRepository
 * @returns Full name of the province
 */
export const formatProvince = async (
  provinceCode: string,
  provinceRepository: Repository<Province>,
) => {
  const provinceName = await provinceRepository.findOne({
    where: { provinceCode: provinceCode },
  });
  // TODO: Cache this ^ data
  return provinceName.provinceName;
};
