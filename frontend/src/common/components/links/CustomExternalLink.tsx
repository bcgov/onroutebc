import "./CustomExternalLink.scss";
import { ExternalLinkProps } from "./types/LinkProps";
import { CustomLinkContent } from "./CustomLinkContent";

export const CustomExternalLink = (props: ExternalLinkProps) => {
  const { withLinkIcon, ...linkProps } = props;

  const className = () => {
    const baseClassName = "custom-link";
    return linkProps.className
      ? `${baseClassName} ${linkProps.className}`
      : baseClassName;
  };

  return (
    <a {...linkProps} className={className()}>
      <CustomLinkContent withLinkIcon={withLinkIcon}>
        {linkProps.children}
      </CustomLinkContent>
    </a>
  );
};
