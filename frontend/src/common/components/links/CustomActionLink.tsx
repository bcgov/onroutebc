import { Link } from "@mui/material";

import "./CustomActionLink.scss";
import { CustomActionLinkProps } from "./types/LinkProps";
import { getDefaultRequiredVal } from "../../helpers/util";

export const CustomActionLink = (
  props: CustomActionLinkProps
) => {
  const component = getDefaultRequiredVal("button", props.component);
  const variant = getDefaultRequiredVal("body2", props.variant);
  const className = () => {
    const baseClassName = "custom-action-link";
    return props.className
      ? `${baseClassName} ${props.className}`
      : baseClassName;
  };
    
  return (
    <Link
      {...props}
      component={component}
      variant={variant}
      className={className()}
    >
      {props.children}
    </Link>
  );
};
