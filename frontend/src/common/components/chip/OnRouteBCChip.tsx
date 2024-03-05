import { getDefaultRequiredVal } from "../../helpers/util";
import "./OnRouteBCChip.scss";

/**
 * A simple chip component to be displayed inside a table cell in a highlighted text.
 */
export const OnRouteBCChip = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => {
  const additionalClassName = getDefaultRequiredVal("", className);

  return (
    <span className={`onroutebc-chip ${additionalClassName}`}>{message}</span>
  );
};

OnRouteBCChip.displayName = "OnRouteBCChip";
