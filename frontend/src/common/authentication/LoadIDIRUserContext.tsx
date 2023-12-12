import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserContext } from "../../features/manageProfile/apiManager/hooks";
import { ERROR_ROUTES } from "../../routes/constants";

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
  const { isLoading, isError } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading) {
      if (isError) {
        navigate(ERROR_ROUTES.UNAUTHORIZED);
      }
    }
  }, [isLoading]);
  return null;
};
