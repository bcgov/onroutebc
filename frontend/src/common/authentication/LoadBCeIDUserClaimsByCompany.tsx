import { useEffect } from "react";
import { useNavigate } from "react-router";

import { ERROR_ROUTES } from "../../routes/constants";
import { Nullable } from "../types/common";
import { UserClaimsType } from "./types";
import {
  useUserClaimsByCompanyId,
  useUserClaimsByCompanyIdQuery,
} from "../../features/manageProfile/apiManager/hooks";

/*
 * A simple component that merely calls a react query hook.
 * Why do we need this?
 * React Hooks rules do not allow conditional execution of hooks since the react DOM
 * needs to know the order of execution of hooks per component.
 *
 * UserClaimsByCompany is relevant only after the BCeID user has logged in and the companyId is set
 * and hence only has to be executed after the conditions are met.
 */
export const LoadBCeIDUserClaimsByCompany = () => {
  const {
    isPending,
    isError,
    data: userClaimsData,
  } = useUserClaimsByCompanyIdQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending) {
      if (isError) {
        navigate(ERROR_ROUTES.UNAUTHORIZED);
      }
    }
  }, [isPending, isError]);

  useUserClaimsByCompanyId(userClaimsData as Nullable<UserClaimsType[]>);

  return null;
};
