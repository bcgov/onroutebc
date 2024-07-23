/* eslint-disable @typescript-eslint/no-unused-vars */
import { usePermissionMatrix } from "../../authentication/PermissionMatrix";
import { PermissionConfigType } from "../../authentication/types";

/**
 * Renders a component if it meets the criteria specified.
 */
export const RenderIf = ({
  component,
  disallowedAuthGroups,
  allowedIDIRAuthGroups,
  allowedBCeIDAuthGroups,
  featureFlag,
  additionalConditionToCall,
  onlyConditionToCheck
}: {
  /**
   * The component to be rendered.
   */
  component: JSX.Element;
} & PermissionConfigType): JSX.Element => {
  const aas = usePermissionMatrix({
    disallowedAuthGroups,
    allowedIDIRAuthGroups,
    allowedBCeIDAuthGroups,
    featureFlag,
    additionalConditionToCall,
    onlyConditionToCheck
  });
  console.log('aas:::', aas);
  if (aas) {
    return <>{component}</>
  } else {
    return <></>
  }
  // const { userDetails, idirUserDetails } = useContext(OnRouteBCContext);
  // const { data: featureFlags } = useFeatureFlagsQuery();
  // const isIdir = Boolean(idirUserDetails?.userAuthGroup);
  
  // // If the onlyConditionToCheck function is given, call that alone and exit.
  // if (onlyConditionToCheck && onlyConditionToCheck()) {
  //   return <>{component}</>; 
  // }
  // let shouldRender = false;
  // let currentUserAuthGroup;
  // if (isIdir) {
  //   currentUserAuthGroup = idirUserDetails?.userAuthGroup;
  //   shouldRender = Boolean(
  //     currentUserAuthGroup &&
  //       allowedIDIRAuthGroups?.includes(currentUserAuthGroup),
  //   );
  // } else {
  //   currentUserAuthGroup = userDetails?.userAuthGroup;
  //   shouldRender = Boolean(
  //     currentUserAuthGroup &&
  //       allowedBCeIDAuthGroups?.includes(currentUserAuthGroup),
  //   );
  // }
  // if (disallowedAuthGroups?.length) {
  //   shouldRender = Boolean(
  //     currentUserAuthGroup &&
  //       !disallowedAuthGroups.includes(currentUserAuthGroup),
  //   );
  // }
  // if (shouldRender && additionalConditionToCall) {
  //   shouldRender = shouldRender && additionalConditionToCall();
  // }
  // if (featureFlag) {
  //   shouldRender = featureFlags?.[featureFlag] === "ENABLED";
  // }
  // if (shouldRender) {
  //   return <>{component}</>;
  // }
  // return <></>;
};
