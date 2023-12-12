import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserRolesByCompanyId } from "../../features/manageProfile/apiManager/hooks";
import { ERROR_ROUTES } from "../../routes/constants";

/*
 * A simple component that merely calls a react query hook.
 * Why do we need this?
 * React Hooks rules do not allow conditional execution of hooks since the react DOM
 * needs to know the order of execution of hooks per component.
 *
 * UserRolesByCompany is relevant only after the BCeID user has logged in and the companyId is set
 * and hence only has to be executed after the conditions are met.
 */
export const LoadBCeIDUserRolesByCompany = () => {
  const { isLoading, isError } = useUserRolesByCompanyId();
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
