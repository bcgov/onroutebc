import { PowerUnitTypesService } from 'src/modules/vehicles/power-unit-types/power-unit-types.service';
import { TrailerTypesService } from 'src/modules/vehicles/trailer-types/trailer-types.service';
import { PermitData } from '../interface/permitData.interface';

/**
 * Gets the full type and subtype names from either the power unit or trailer type codes
 * @param permitData
 * @param powerUnitTypeService
 * @param trailerTypeService
 * @returns an object that includes full names of the vehicle type and subtype
 */
export const formatVehicleTypes = async (
  permitData: PermitData,
  powerUnitTypeService: PowerUnitTypesService, //TODO: fix prop drilling?
  trailerTypeService: TrailerTypesService, //TODO: fix prop drilling?
) => {
  let vehicleType: string;
  let vehicleSubType: string;

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

  return { vehicleType, vehicleSubType };
};
