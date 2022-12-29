import { getOpenshiftEnv } from "../../../../common/helpers/helpers";

const ENV = getOpenshiftEnv();

export const MV_BASE_URL =
  ENV === "localhost"
    ? "http://localhost:5000"
    : `https://onroutebc-${ENV}-backend.apps.silver.devops.gov.bc.ca`;

export const VEHICLES_API = {
  GET_ALL_POWER_UNITS: `${MV_BASE_URL}/vehicles/powerUnit`,
};
