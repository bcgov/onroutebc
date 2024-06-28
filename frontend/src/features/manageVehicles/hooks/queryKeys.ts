export const QUERY_KEYS = {
  POWER_UNIT_SUBTYPES: () => ["powerUnitSubTypes"],
  POWER_UNITS: () => ["powerUnits"],
  POWER_UNIT: (companyId: string, vehicleId?: string) =>
    ["powerUnit", vehicleId, companyId],
  TRAILER_SUBTYPES: () => ["trailerSubTypes"],
  TRAILERS: () => ["trailers"],
  TRAILER: (companyId: string, vehicleId?: string) =>
    ["trailer", vehicleId, companyId],
};
