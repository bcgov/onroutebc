import { useEffect } from "react";
import { useNavigate } from "react-router";

import { ERROR_ROUTES } from "../../routes/constants";
import {
  useUserContext,
  useUserContextQuery,
} from "../../features/manageProfile/apiManager/hooks";

/*
 * A simple component that merely calls a react query hook.
 * Why do we need this?
 * React Hooks rules do not allow conditional execution of hooks since the react DOM
 * needs to know the order of execution of hooks per component.
 *
 * This component is useful where the idir user tries to refresh the page
 * from any protected route.
 */
export const LoadIDIRUserContext = () => {
  const navigate = useNavigate();
  const {
    isPending,
    isError,
    data: userContextResponse,
  } = useUserContextQuery();

  useEffect(() => {
    if (!isPending) {
      if (isError) {
        navigate(ERROR_ROUTES.UNAUTHORIZED);
      }
    }
  }, [isPending, isError]);

  useUserContext(userContextResponse);

  return null;
};
