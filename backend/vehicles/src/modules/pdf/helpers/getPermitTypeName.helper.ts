import { Cache } from 'cache-manager';

/**
 * Converts permitTypeCode to Permit Type Name using the ORBC_VT_PERMIT_TYPE table
 * @param cacheManager
 * @param permitTypeCode
 * @returns Full name of the permit type
 */
export const getPermitTypeName = async (
  cacheManager: Cache,
  permitTypeCode: string,
) => {
  // TODO: Error handling if cache can't find values
 return await cacheManager.get(permitTypeCode) as string;
};
