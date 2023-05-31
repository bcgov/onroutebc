import { PermitType } from 'src/modules/permit/entities/permit-type.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { TTL } from '../constants/cache.constant';

/**
 * Converts permitTypeCode to Permit Type Name using the ORBC_VT_PERMIT_TYPE table
 * @param cacheManager
 * @param permitTypeCode
 * @param permitTypeRepository
 * @returns Full name of the permit type
 */
export const getPermitTypeName = async (
  cacheManager: Cache,
  permitTypeCode: string,
  permitTypeRepository: Repository<PermitType>,
) => {
  const cachedData: string = await cacheManager.get(permitTypeCode);

  if (cachedData) return cachedData;

  const permitTypeName = await permitTypeRepository.findOne({
    where: { permitTypeId: permitTypeCode },
  });

  await cacheManager.set(permitTypeCode, permitTypeName.name, TTL);

  return permitTypeName.name;
};
