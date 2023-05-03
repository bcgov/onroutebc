import { useUserRolesByCompanyId } from "../../features/manageProfile/apiManager/hooks";

/*
 * A simple component that merely calls a react query hook.
 * Why do we need this? 
 * React Hooks rules do not allow conditional execution of hooks since the react DOM
 * needs to know the order of execution of hooks per component.
 * 
 * UserRolesByCompany is relevant only after the user has logged in and the companyId is set
 * and hence only has to be executed after the conditions are met.
 */
export const LoadUserRolesByCompany = () => {
  useUserRolesByCompanyId();
  return null;
};
