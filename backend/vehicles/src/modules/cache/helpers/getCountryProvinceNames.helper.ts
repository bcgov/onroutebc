import { Cache } from 'cache-manager';
import { TTL } from '../constants/cache.constant';
import { CommonService } from 'src/modules/common/common.service';

/**
 * Converts CountryCode to Country Name using the ORBC_VT_COUNTRY table
 * @param cacheManager
 * @param countryCode
 * @param commonService
 * @returns Full name of the country
 */
export const getCountryName = async (
  cacheManager: Cache,
  countryCode: string,
  commonService: CommonService,
) => {
  let cachedData: string = await cacheManager.get(countryCode);

  if (cachedData) return cachedData;

  const countryName = await commonService.findOneCountry(countryCode);

  await cacheManager.set(countryCode, countryName.countryName, TTL);

  return countryName.countryName;
};

/**
 * Converts provinceCode to Province Name using the ORBC_VT_PROVINCE table
 * @param cacheManager
 * @param provinceCode
 * @param commonService
 * @returns Full name of the province
 */
export const getProvinceName = async (
  cacheManager: Cache,
  provinceCode: string,
  commonService: CommonService,
) => {
  let cachedData: string = await cacheManager.get(provinceCode);

  if (cachedData) return cachedData;

  const provinceName = await commonService.findOneProvince(provinceCode);

  await cacheManager.set(provinceCode, provinceName.provinceName, TTL);

  return provinceName.provinceName;
};
