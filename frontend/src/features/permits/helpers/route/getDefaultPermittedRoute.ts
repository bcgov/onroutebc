import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { Nullable, RequiredOrNull } from "../../../../common/types/common";
import { PermittedRoute } from "../../types/PermittedRoute";
import { PERMIT_TYPES, PermitType } from "../../types/PermitType";
import { getDefaultManualRoute } from "./getDefaultManualRoute";

export const getDefaultPermittedRoute = (
  permitType: PermitType,
  permittedRoute?: Nullable<PermittedRoute>,
): RequiredOrNull<PermittedRoute> => {
  if (
    permitType !== PERMIT_TYPES.STOS &&
    permitType !== PERMIT_TYPES.STOW &&
    permitType !== PERMIT_TYPES.MFP &&
    permitType !== PERMIT_TYPES.STWSE &&
    permitType !== PERMIT_TYPES.STGVWI
  )
    return null;

  return {
    manualRoute: getDefaultManualRoute(permitType, permittedRoute?.manualRoute),
    routeDetails: getDefaultRequiredVal("", permittedRoute?.routeDetails),
  };
};
