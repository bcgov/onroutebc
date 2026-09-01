import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";

const POWER_UNIT_BASE_URI = (companyId: string | number) =>
  `${VEHICLES_URL}/companies/${companyId}/vehicles/powerUnits`;

const TRAILER_BASE_URI = (companyId: string | number) =>
  `${VEHICLES_URL}/companies/${companyId}/vehicles/trailers`;

export const VEHICLES_API = {
  POWER_UNIT_TYPES: `${VEHICLES_URL}/vehicles/power-unit-types`,
  TRAILER_TYPES: `${VEHICLES_URL}/vehicles/trailer-types`,
  POWER_UNITS: {
    ALL: (companyId: string | number) =>
      `${POWER_UNIT_BASE_URI(companyId)}`,
    DETAIL: (companyId: string | number, powerUnitId: string) =>
      `${POWER_UNIT_BASE_URI(companyId)}/${powerUnitId}`,
    ADD: (companyId: string | number) =>
      `${POWER_UNIT_BASE_URI(companyId)}`,
    UPDATE: (companyId: string | number, powerUnitId: string) =>
      `${POWER_UNIT_BASE_URI(companyId)}/${powerUnitId}`,
    DELETE: (companyId: string | number) =>
      `${POWER_UNIT_BASE_URI(companyId)}/delete-requests`,
  },
  TRAILERS: {
    ALL: (companyId: string | number) =>
      `${TRAILER_BASE_URI(companyId)}`,
    DETAIL: (companyId: string | number, trailerId: string) =>
      `${TRAILER_BASE_URI(companyId)}/${trailerId}`,
    ADD: (companyId: string | number) =>
      `${TRAILER_BASE_URI(companyId)}`,
    UPDATE: (companyId: string | number, trailerId: string) =>
      `${TRAILER_BASE_URI(companyId)}/${trailerId}`,
    DELETE: (companyId: string | number) =>
      `${TRAILER_BASE_URI(companyId)}/delete-requests`,
  },
};
