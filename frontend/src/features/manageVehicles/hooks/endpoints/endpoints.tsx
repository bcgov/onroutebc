import { Config } from "../../../../config";

export const VEHICLE_URL = Config.VITE_API_VEHICLE_URL;

export const VEHICLES_API = {
  GET_ALL_POWER_UNITS: `${VEHICLE_URL}/vehicles/powerUnits`,
};
