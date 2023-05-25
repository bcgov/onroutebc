import { Country } from 'src/modules/common/entities/country.entity';
import { Province } from 'src/modules/common/entities/province.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { TTL } from '../constants/cache.constant';

/**
 * Converts CountryCode to Country Name using the ORBC_VT_COUNTRY table
 * @param cacheManager
 * @param countryCode
 * @param countryRepository
 * @returns Full name of the country
 */
export const formatCountry = async (
  cacheManager: Cache,
  countryCode: string,
  countryRepository: Repository<Country>,
) => {
  let cachedData: string = await cacheManager.get(countryCode);

  console.log('countryCode', countryCode);
  console.log('cachedData', cachedData);

  if (cachedData) return cachedData;

  const countryName = await countryRepository.findOne({
    where: { countryCode: countryCode },
  });

  await cacheManager.set(countryCode, countryName.countryName, TTL);

  return countryName.countryName;
};

/**
 * Converts provinceCode to Province Name using the ORBC_VT_PROVINCE table
 * @param cacheManager
 * @param provinceCode
 * @param provinceRepository
 * @returns Full name of the province
 */
export const formatProvince = async (
  cacheManager: Cache,
  provinceCode: string,
  provinceRepository: Repository<Province>,
) => {
  let cachedData: string = await cacheManager.get(provinceCode);

  console.log('provinceCode', provinceCode);
  console.log('cachedData', cachedData);

  if (cachedData) return cachedData;

  const provinceName = await provinceRepository.findOne({
    where: { provinceCode: provinceCode },
  });

  await cacheManager.set(provinceCode, provinceName.provinceName, TTL);

  return provinceName.provinceName;
};
