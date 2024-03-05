import { VEHICLE_TYPES, VehicleType } from "../../../../types/Vehicle";
import {
  PowerUnitDetail,
  VehicleFormDetail,
  countrySelect,
  licensedGvwInput,
  makeInput,
  plateInput,
  powerUnitTypeCodeSelect,
  provinceSelect,
  steerAxleTireSizeInput,
  submitErrorsDisplay,
  trailerTypeCodeSelect,
  unitNumberInput,
  vinInput,
  yearInput,
} from "./access";

export const assertSuccessfulSubmit = async (
  vehicleType: VehicleType,
  vehicleDetails: VehicleFormDetail,
) => {
  const unitNumber = await unitNumberInput();
  const make = await makeInput();
  const year = await yearInput();
  const vin = await vinInput();
  const plate = await plateInput();
  const country = await countrySelect();
  const province = await provinceSelect();

  expect(unitNumber).toHaveValue(vehicleDetails.newUnitNumber);
  expect(make).toHaveValue(vehicleDetails.newMake);
  expect(year).toHaveValue(vehicleDetails.newYear);
  expect(vin).toHaveValue(vehicleDetails.newVin);
  expect(plate).toHaveValue(vehicleDetails.newPlate);
  expect(country).toHaveTextContent(vehicleDetails.newCountry);
  expect(province).toHaveTextContent(vehicleDetails.newProvince);

  if (vehicleType === VEHICLE_TYPES.POWER_UNIT) {
    const powerUnitDetails = vehicleDetails as PowerUnitDetail;
    const licensedGvw = await licensedGvwInput();
    const steerAxleTireSize = await steerAxleTireSizeInput();
    const subtype = await powerUnitTypeCodeSelect();
    expect(subtype).toHaveTextContent(vehicleDetails.newSubtype);
    expect(licensedGvw).toHaveValue(powerUnitDetails.newGvw);
    expect(steerAxleTireSize).toHaveValue(powerUnitDetails.newTireSize);
  } else {
    const subtype = await trailerTypeCodeSelect();
    expect(subtype).toHaveTextContent(vehicleDetails.newSubtype);
  }

  // Assert - no errors shown after submission
  expect(async () => await submitErrorsDisplay()).rejects.toThrow();
};
