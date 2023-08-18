import { useIDIRUserContext } from "../../features/manageProfile/apiManager/hooks";

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
  useIDIRUserContext();
  return null;
};
