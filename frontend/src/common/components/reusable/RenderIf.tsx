import {
  usePermissionMatrix,
  PermissionConfigType,
} from "../../authentication/PermissionMatrix";

/**
 * Renders a component if it meets the criteria specified.
 */
export const RenderIf = ({
  component,
  ...permissionConfig
}: {
  /**
   * The component to be rendered.
   */
  component: JSX.Element;
} & PermissionConfigType): JSX.Element => {
  const shouldRender = usePermissionMatrix(permissionConfig);
  if (shouldRender) {
    return <>{component}</>;
  } else {
    return <></>;
  }
};
