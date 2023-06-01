import { Cache } from 'cache-manager';

/**
 * Converts CountryCode to Country Name using the ORBC_VT_COUNTRY table
 * @param cacheManager
 * @param countryCode
 * @returns Full name of the country
 */
export const getCountryName = async (
  cacheManager: Cache,
  countryCode: string,
) => {
  // TODO: Error handling if cache can't find values
  return await cacheManager.get(countryCode) as string;
};

/**
 * Converts provinceCode to Province Name using the ORBC_VT_PROVINCE table
 * @param cacheManager
 * @param provinceCode
 * @returns Full name of the province
 */
export const getProvinceName = async (
  cacheManager: Cache,
  provinceCode: string,
) => {
  // TODO: Error handling if cache can't find values
  return await cacheManager.get(provinceCode) as string;
};
