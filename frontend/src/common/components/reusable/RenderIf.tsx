import { useContext } from "react";
import OnRouteBCContext, {
  // BCeIDUserDetailContext,
  // IDIRUserDetailContext,
} from "../../authentication/OnRouteBCContext";
import { PermissionConfigType } from "../../authentication/types";
import { useFeatureFlagsQuery } from "../../hooks/hooks";

/**
 * Renders a component if it meets the criteria specified.
 */
export const RenderIf = ({
  component,
  disallowedAuthGroups,
  allowedIDIRAuthGroups,
  allowedBCeIDAuthGroups,
  featureFlag,
  customFunction,
}: {
  /**
   * The component to be rendered.
   */
  component: JSX.Element;
} & PermissionConfigType): JSX.Element => {
  const { userDetails, idirUserDetails } = useContext(OnRouteBCContext);
  const { data: featureFlags } = useFeatureFlagsQuery();
  const isIdir = Boolean(idirUserDetails?.userAuthGroup);
  let shouldRender = false;
  let currentUserAuthGroup;
  if (isIdir) {
    currentUserAuthGroup = idirUserDetails?.userAuthGroup;
    shouldRender = Boolean(
      currentUserAuthGroup && allowedIDIRAuthGroups?.includes(currentUserAuthGroup),
    );
  } else {
    currentUserAuthGroup = userDetails?.userAuthGroup;
    shouldRender = Boolean(
      currentUserAuthGroup && allowedBCeIDAuthGroups?.includes(currentUserAuthGroup),
    );
  }
  if (disallowedAuthGroups?.length) {
    shouldRender = Boolean(
      currentUserAuthGroup &&
        !disallowedAuthGroups.includes(currentUserAuthGroup),
    );
  }
  if (customFunction) {
    shouldRender = shouldRender && customFunction();
  }
  if (featureFlag) {
    shouldRender = featureFlags?.[featureFlag] === 'ENABLED'
  }
  if (shouldRender) {
    return <>{component}</>;
  }
  return <></>;
};
