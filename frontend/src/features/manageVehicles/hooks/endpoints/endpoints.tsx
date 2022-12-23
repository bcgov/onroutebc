export const MV_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "http://localhost:5000"
    : "http://localhost:5000";

export const VEHICLES_API = {
  GET_ALL_POWER_UNITS: `${MV_BASE_URL}/vehicles/powerUnit`,
};
