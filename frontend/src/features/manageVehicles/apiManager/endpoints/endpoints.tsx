export const VEHICLE_URL =
  import.meta.env.VITE_API_VEHICLE_URL || envConfig.VITE_API_VEHICLE_URL;

const TEST_COMPANY_GUID = "74";

export const VEHICLES_API = {
  GET_ALL_POWER_UNITS: `${VEHICLE_URL}/companies/${TEST_COMPANY_GUID}/vehicles/powerUnits`,
  POWER_UNIT: `${VEHICLE_URL}/companies/${TEST_COMPANY_GUID}/vehicles/powerUnits`,
  POWER_UNIT_TYPES: `${VEHICLE_URL}/vehicles/power-unit-types`,

  GET_ALL_TRAILERS: `${VEHICLE_URL}/companies/${TEST_COMPANY_GUID}/vehicles/trailers`,
  TRAILER: `${VEHICLE_URL}/companies/${TEST_COMPANY_GUID}/vehicles/trailers`,
  TRAILER_TYPES: `${VEHICLE_URL}/vehicles/trailer-types`,
};
