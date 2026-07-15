import {
  PERMIT_ACTION_ORIGINS,
  PermitActionOrigin,
} from "../types/PermitActionOrigin";
import { PERMIT_TABS } from "../types/PermitTabs";

/**
 * Maps a permit action's starting location to the company permit-list tab
 * that the workflow should return to.
 */
export const getPermitTabForActionOrigin = (
  permitActionOrigin?: PermitActionOrigin,
) => {
  if (permitActionOrigin === PERMIT_ACTION_ORIGINS.ACTIVE_PERMITS) {
    return PERMIT_TABS.ACTIVE_PERMITS;
  }

  if (permitActionOrigin === PERMIT_ACTION_ORIGINS.EXPIRED_PERMITS) {
    return PERMIT_TABS.EXPIRED_PERMITS;
  }

  return undefined;
};
