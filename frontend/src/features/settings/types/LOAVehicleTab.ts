export const LOA_VEHICLE_TABS = {
  POWER_UNITS: 0,
  TRAILERS: 1,
} as const;

export type LOAVehicleTab = typeof LOA_VEHICLE_TABS[keyof typeof LOA_VEHICLE_TABS];
