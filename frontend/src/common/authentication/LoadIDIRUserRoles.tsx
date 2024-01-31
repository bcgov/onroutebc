import { useEffect } from "react";
import { useNavigate } from "react-router";

import { ERROR_ROUTES } from "../../routes/constants";
import { Nullable } from "../types/common";
import { UserRolesType } from "./types";
import {
  useIDIRUserRoles,
  useIDIRUserRolesQuery,
} from "../../features/manageProfile/apiManager/hooks";

/*
 * A simple component that merely calls a react query hook.
 * Why do we need this?
 * React Hooks rules do not allow conditional execution of hooks since the react DOM
 * needs to know the order of execution of hooks per component.
 *
 * IDIRRoles is relevant only after the idir user has logged in
 * and hence only has to be executed after the conditions are met.
 */
export const LoadIDIRUserRoles = () => {
  const { isPending, isError, data: userRoles } = useIDIRUserRolesQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending) {
      if (isError) {
        navigate(ERROR_ROUTES.UNAUTHORIZED);
      }
    }
  }, [isPending, isError]);

  useIDIRUserRoles(userRoles as Nullable<UserRolesType[]>);

  return null;
};
