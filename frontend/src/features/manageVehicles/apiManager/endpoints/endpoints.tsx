export const VEHICLE_URL =
  import.meta.env.VITE_API_VEHICLE_URL || envConfig.VITE_API_VEHICLE_URL;

export const VEHICLES_API = {
  POWER_UNIT: `${VEHICLE_URL}/vehicles/powerUnits`,
  POWER_UNIT_TYPES: `${VEHICLE_URL}/vehicles/power-unit-types`,

  TRAILER: `${VEHICLE_URL}/vehicles/trailers`,
  TRAILER_TYPES: `${VEHICLE_URL}/vehicles/trailer-types`,
};
