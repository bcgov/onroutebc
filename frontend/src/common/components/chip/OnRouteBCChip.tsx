import { Tooltip } from "@mui/material";
import { getDefaultRequiredVal } from "../../helpers/util";
import "./OnRouteBCChip.scss";

/**
 * A simple chip component to be displayed inside a table cell in a highlighted text.
 */
export const OnRouteBCChip = ({
  message,
  hoverText,
  className,
}: {
  message: string;
  hoverText: string;
  className?: string;
}) => {
  const additionalClassName = getDefaultRequiredVal("", className);

  return (
    <Tooltip title={hoverText}>
      <span className={`onroutebc-chip ${additionalClassName}`}>{message}</span>
    </Tooltip>
  );
};

OnRouteBCChip.displayName = "OnRouteBCChip";
