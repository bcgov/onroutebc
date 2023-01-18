export const VEHICLE_URL = import.meta.env.VITE_API_VEHICLE_URL || envConfig.VITE_API_VEHICLE_URL;

export const VEHICLES_API = {
  GET_ALL_POWER_UNITS: `${VEHICLE_URL}/vehicles/powerUnits`,
  POWER_UNIT: `${VEHICLE_URL}/vehicles/powerUnit`
};
