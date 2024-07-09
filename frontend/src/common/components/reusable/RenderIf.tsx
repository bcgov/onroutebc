import { useContext } from "react";
import OnRouteBCContext, {
  BCeIDUserDetailContext,
  IDIRUserDetailContext,
} from "../../authentication/OnRouteBCContext";
import { UserAuthGroupType, UserRolesType } from "../../authentication/types";

/**
 * Renders a component if it meets the criteria specified.
 */
export const RenderIf = ({
  component,
  allowedRole,
  disallowedAuthGroups,
  allowedAuthGroups,
}: {
  /**
   * The component to be rendered.
   */
  component: JSX.Element;
  /**
   * The auth groups that are disallowed from seeing the component.
   *
   * Given first preference if specified. If the user has one of
   * the specified auth groups, the component WILL NOT render.
   *
   * Example use-case: `ORBC_READ_PERMIT` is a role that's available to
   * the `FINANCE` users but they aren't allowed privileges to see
   * Applications in Progress.
   * In this instance, `disallowedAuthGroups = ['FINANCE']`.
   */
  disallowedAuthGroups?: UserAuthGroupType[];
  /**
   * The only role to check against.
   *
   * If the user has the specified role, the component will render.
   * Given second preference.
   *
   * Only one of `allowedRole` or `allowedAuthGroups` is expected.
   * If both `allowedRole` and `allowedAuthGroups` are specified,
   * `allowedAuthGroups` will be ignored.
   */
  allowedRole?: UserRolesType;
  /**
   * The only role to check against.
   *
   * If the user has the specified auth group, the component will render.
   *
   * Given last preference.
   *
   * Only used if `allowedRole` is not given.
   */
  allowedAuthGroups?: UserAuthGroupType[];
}): JSX.Element => {
  const { userRoles, userDetails, idirUserDetails } =
    useContext(OnRouteBCContext);
  const isIdir = Boolean(idirUserDetails?.userAuthGroup);
  const currentUserAuthGroup = isIdir
    ? (idirUserDetails as IDIRUserDetailContext).userAuthGroup
    : (userDetails as BCeIDUserDetailContext).userAuthGroup;
  let shouldRender = false;
  if (disallowedAuthGroups) {
    shouldRender = !disallowedAuthGroups.includes(currentUserAuthGroup);
  } else if (allowedRole) {
    shouldRender = (userRoles as UserRolesType[]).includes(allowedRole);
  } else if (allowedAuthGroups) {
    shouldRender = allowedAuthGroups.includes(currentUserAuthGroup);
  }
  if (shouldRender) {
    return <>{component}</>;
  }
  return <></>;
};
