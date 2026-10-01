import { Cache } from 'cache-manager';
import { CacheKey } from '@common/enum/cache-key.enum';

export const createCacheMap = <T extends object>(
  dataArray: T[],
  keyProperty: string,
  valueProperty: string,
): Map<string, string> => {
  const cacheMap = new Map<string, string>();
  dataArray.forEach((element) => {
    const record = element as Record<string, unknown>;
    if (!(keyProperty in record)) {
      throw new Error(`keyProperty '${keyProperty}' not found in element.`);
    } else if (!(valueProperty in record)) {
      throw new Error(`valueProperty '${valueProperty}' not found in element.`);
    }
    const key = String(record[keyProperty]);
    const value = String(record[valueProperty]);
    cacheMap.set(key, value);
  });
  return cacheMap;
};

export const addToCache = async (
  cacheManager: Cache,
  key: CacheKey,
  item: string | Map<string, string> | JSON | object,
) => {
  await cacheManager.set(key, item);
};

function isMapOfString(obj: unknown): obj is Map<string, string> {
  return obj instanceof Map;
}

export const getFromCache = async (
  cacheManager: Cache,
  key: CacheKey,
  cacheMapKey?: string,
): Promise<string> => {
  const value = await cacheManager.get(key);
  if (isMapOfString(value)) {
    if (!cacheMapKey) {
      throw new Error('cacheMapKey parameter is required');
    }
    return value.get(cacheMapKey);
  } else {
    return value as string;
  }
};

export const getMapFromCache = async (
  cacheManager: Cache,
  key: CacheKey,
): Promise<Map<string, string>> => {
  const cacheMapObject: Map<string, string> = await cacheManager.get(key);
  return cacheMapObject;
};
