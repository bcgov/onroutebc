import { getOpenshiftEnv } from "../../../../common/helpers/helpers";

const ENV = getOpenshiftEnv();

/**
 * If the Env is a number, then it is in dev and 
 * the number corresponds to the PR number in github
 * 
 * If the env is unknown, it may be in prod, try the following url:
 * https://onroutebc-backend.apps.silver.devops.gov.bc.ca
 * 
 */
export const MV_BACKEND_URL = import.meta.env.VITE_BACKEND_API|| ((window as any)._env_ && (window as any)._env_.VITE_BACKEND_API) 

export const VEHICLES_API = {
  GET_ALL_POWER_UNITS: `${MV_BACKEND_URL}/vehicles/powerUnit`,
};
