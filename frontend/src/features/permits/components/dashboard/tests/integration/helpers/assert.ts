import { VehicleTypesAsString } from "../../../../../../manageVehicles/types/managevehicles";
import { getDefaultPowerUnitTypes, getDefaultTrailerTypes } from "../fixtures/getVehicleInfo";
import { subtypeOptions } from "./access";

export const assertVehicleSubtypeOptions = async (vehicleType: VehicleTypesAsString) => {
  const shownSubtypes = vehicleType === "powerUnit" 
    ? getDefaultPowerUnitTypes().slice(0, -1).map(subtype => subtype.type)
    : getDefaultTrailerTypes().slice(0, -1).map(subtype => subtype.type);
  
  const excludedSubtypes = vehicleType === "powerUnit" 
    ? getDefaultPowerUnitTypes().slice(-1).map(subtype => subtype.type)
    : getDefaultTrailerTypes().slice(-1).map(subtype => subtype.type);

  const options = await subtypeOptions(shownSubtypes, excludedSubtypes);
  expect(options.properOptions).toHaveLength(shownSubtypes.length);
  expect(options.displayedOptions).toHaveLength(shownSubtypes.length);
  expect(options.excludedOptions).toHaveLength(0);
  expect(options.displayedExcludedOptions).toHaveLength(0);
};
