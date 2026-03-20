import { useEffect } from "react";
import { useNavigate } from "react-router";

import { ERROR_ROUTES } from "../../routes/constants";
import { Nullable } from "../types/common";
import { UserClaimsType } from "./types";
import {
  useIDIRUserClaims,
  useIDIRUserClaimsQuery,
} from "../../features/manageProfile/apiManager/hooks";

/*
 * A simple component that merely calls a react query hook.
 * Why do we need this?
 * React Hooks rules do not allow conditional execution of hooks since the react DOM
 * needs to know the order of execution of hooks per component.
 *
 * IDIRClaims is relevant only after the idir user has logged in
 * and hence only has to be executed after the conditions are met.
 */
export const LoadIDIRUserClaims = () => {
  const { isPending, isError, data: userClaims } = useIDIRUserClaimsQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending) {
      if (isError) {
        navigate(ERROR_ROUTES.UNAUTHORIZED);
      }
    }
  }, [isPending, isError]);

  useIDIRUserClaims(userClaims as Nullable<UserClaimsType[]>);

  return null;
};
