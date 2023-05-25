import { PowerUnitTypesService } from 'src/modules/vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from 'src/modules/vehicles/trailer-types/trailer-types.service';

import { Cache } from 'cache-manager';
import { PermitData } from 'src/modules/pdf/interface/permitData.interface';
import { TTL } from '../constants/cache.constant';

/**
 * Gets the full type and subtype names from either the power unit or trailer type codes
 * @param cacheManager
 * @param permitData
 * @param powerUnitTypeService
 * @param trailerTypeService
 * @returns an object that includes full names of the vehicle type and subtype
 */
export const formatVehicleTypes = async (
  cacheManager: Cache,
  permitData: PermitData,
  powerUnitTypeService: PowerUnitTypesService, //TODO: fix prop drilling?
  trailerTypeService: TrailerTypesService, //TODO: fix prop drilling?
) => {
  let vehicleType: string = await cacheManager.get(
    permitData.vehicleDetails.vehicleType,
  );
  let vehicleSubType: string = await cacheManager.get(
    permitData.vehicleDetails.vehicleSubType,
  );

  if (vehicleType && vehicleSubType) {
    return { vehicleType, vehicleSubType };
  }

  if (permitData.vehicleDetails.vehicleType === 'powerUnit') {
    vehicleType = 'Power Unit';
    const powerUnitDto = await powerUnitTypeService.findOne(
      permitData.vehicleDetails.vehicleSubType,
    );
    vehicleSubType = powerUnitDto.type;
  } else if (permitData.vehicleDetails.vehicleType === 'trailer') {
    vehicleType = 'Trailer';
    const trailerDto = await trailerTypeService.findOne(
      permitData.vehicleDetails.vehicleSubType,
    );
    vehicleSubType = trailerDto.type;
  }

  await cacheManager.set(
    permitData.vehicleDetails.vehicleType,
    vehicleType,
    TTL,
  );
  await cacheManager.set(
    permitData.vehicleDetails.vehicleSubType,
    vehicleSubType,
    TTL,
  );

  return { vehicleType, vehicleSubType };
};
