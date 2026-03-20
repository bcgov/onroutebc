import "./CustomExternalLink.scss";
import { ExternalLinkProps } from "./types/LinkProps";
import { CustomLinkContent } from "./CustomLinkContent";

export const CustomExternalLink = (props: ExternalLinkProps) => {
  const { withLinkIcon, openInNewTab, ...linkProps } = props;

  const className = () => {
    const baseClassName = "custom-link";
    return linkProps.className
      ? `${baseClassName} ${linkProps.className}`
      : baseClassName;
  };

  const linkTarget = openInNewTab ? {
    target: "_blank",
  } : {};

  return (
    <a
      {...linkProps}
      {...linkTarget}
      className={className()}
    >
      <CustomLinkContent withLinkIcon={withLinkIcon}>
        {linkProps.children}
      </CustomLinkContent>
    </a>
  );
};
