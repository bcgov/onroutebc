import {
  VEHICLE_TYPES,
  VehicleType,
} from "../../../../../../manageVehicles/types/Vehicle";
import { subtypeOptions } from "./access";
import {
  getDefaultPowerUnitSubTypes,
  getDefaultTrailerSubTypes,
} from "../fixtures/getVehicleInfo";

export const assertVehicleSubtypeOptions = async (vehicleType: VehicleType) => {
  const shownSubtypes =
    vehicleType === VEHICLE_TYPES.POWER_UNIT
      ? getDefaultPowerUnitSubTypes()
          .slice(0, -1)
          .map((subtype) => subtype.type)
      : getDefaultTrailerSubTypes()
          .slice(0, -1)
          .map((subtype) => subtype.type);

  const excludedSubtypes =
    vehicleType === VEHICLE_TYPES.POWER_UNIT
      ? getDefaultPowerUnitSubTypes()
          .slice(-1)
          .map((subtype) => subtype.type)
      : getDefaultTrailerSubTypes()
          .slice(-1)
          .map((subtype) => subtype.type);

  const options = await subtypeOptions(shownSubtypes, excludedSubtypes);
  expect(options.properOptions).toHaveLength(shownSubtypes.length);
  expect(options.displayedOptions).toHaveLength(shownSubtypes.length);
  expect(options.excludedOptions).toHaveLength(0);
  expect(options.displayedExcludedOptions).toHaveLength(0);
};
