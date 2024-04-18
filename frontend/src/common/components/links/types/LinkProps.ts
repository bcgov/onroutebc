import { LinkProps as MuiLinkProps } from "@mui/material";
import { LinkHTMLAttributes } from "react";
import { LinkProps } from "react-router-dom";

interface CustomLinkProps {
  withLinkIcon?: boolean;
}

type Props<TExternal = boolean> = TExternal extends true
  ? CustomLinkProps & LinkHTMLAttributes<HTMLAnchorElement>
  : CustomLinkProps & LinkProps;

export type ExternalLinkProps = Props<true> & {
  openInNewTab?: boolean;
};

export type InternalLinkProps = Props<false>;
export type CustomActionLinkProps = MuiLinkProps;
