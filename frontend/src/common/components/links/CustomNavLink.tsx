import { Link } from "react-router-dom";

import "./CustomNavLink.scss";
import { InternalLinkProps } from "./types/LinkProps";
import { CustomLinkContent } from "./CustomLinkContent";

export const CustomNavLink = (props: InternalLinkProps) => {
  const { withLinkIcon, ...linkProps } = props;

  const className = () => {
    const baseClassName = "custom-link";
    return linkProps.className
      ? `${baseClassName} ${linkProps.className}`
      : baseClassName;
  };

  return (
    <Link {...linkProps} className={className()}>
      <CustomLinkContent withLinkIcon={withLinkIcon}>
        {linkProps.children}
      </CustomLinkContent>
    </Link>
  );
};
