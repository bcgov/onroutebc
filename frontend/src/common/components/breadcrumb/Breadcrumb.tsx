import { Fragment } from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";

import "./Breadcrumb.scss";

export const Breadcrumb = ({
  links,
}: {
  links: {
    text: string;
    onClick?: () => void;
  }[];
}) => {
  return (
    <Box className="breadcrumb">
      {links.map((link, i) => {
        const isCurrent = i === links.length - 1;
        return isCurrent ? (
          <Typography
            key={link.text}
            className="breadcrumb__link breadcrumb__link--current"
          >
            {link.text}
          </Typography>
        ) : (
          <Fragment key={link.text}>
            <Typography
              className="breadcrumb__link"
              onClick={() => link.onClick?.()}
            >
              {link.text}
            </Typography>
            <FontAwesomeIcon
              className="breadcrumb__right"
              icon={faChevronRight}
            />
          </Fragment>
        );
      })}
    </Box>
  );
};
