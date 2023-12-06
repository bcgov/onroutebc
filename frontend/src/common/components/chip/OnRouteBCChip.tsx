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
  return (
    <span
      className={`onroutebc-chip ${className ? className : ""}`}
    >
      {message}
    </span>
  );
};

OnRouteBCChip.displayName = "OnRouteBCChip";
