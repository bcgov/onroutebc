import { Cache } from 'cache-manager';
import { PermitData } from 'src/modules/pdf/interface/permitData.interface';

/**
 * Gets the full type and subtype names from either the power unit or trailer type codes
 * @param cacheManager
 * @param permitData
 * @returns an object that includes full names of the vehicle type and subtype
 */
export const getVehicleTypeNames = async (
  cacheManager: Cache,
  permitData: PermitData,
) => {

  
  const vehicleType = await cacheManager.get(
    permitData.vehicleDetails.vehicleType,
  ) as string;

  const vehicleSubType = await cacheManager.get(
    permitData.vehicleDetails.vehicleSubType,
  ) as string;

  // TODO: Error handling if cache can't find values

  return { vehicleType, vehicleSubType };
};
