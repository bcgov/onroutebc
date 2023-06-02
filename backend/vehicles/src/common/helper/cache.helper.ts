import { Cache } from 'cache-manager';

export const getFullNameFromCache = async (
  cacheManager: Cache,
  code: string,
) => {
  return await cacheManager.get(code);
};
