import { Link } from "@mui/material";

import "./CustomActionLink.scss";
import { CustomActionLinkProps } from "./types/LinkProps";
import { getDefaultRequiredVal } from "../../helpers/util";

export const CustomActionLink = (
  props: CustomActionLinkProps
) => {
  const { disabled, onClick, ...linkProps } = props;
  const component = getDefaultRequiredVal("button", linkProps.component);
  const variant = getDefaultRequiredVal("body2", linkProps.variant);

  const className = () => {
    const baseClassName = disabled ? 
      "custom-action-link custom-action-link--disabled" :
      "custom-action-link";
    
    return linkProps.className
      ? `${baseClassName} ${linkProps.className}`
      : `${baseClassName}`;
  };
    
  return (
    <Link
      {...linkProps}
      onClick={disabled ? undefined : onClick}
      component={component}
      variant={variant}
      className={className()}
    >
      {linkProps.children}
    </Link>
  );
};
