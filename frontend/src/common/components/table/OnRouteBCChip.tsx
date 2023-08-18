/**
 * A simple chip component to be displayed inside a table cell in a highlighted text.
 */
export const OnRouteBCChip = ({
  message,
  background,
  color,
}: {
  background: string;
  color: string;
  message: string;
}) => {
  return (
    <>
      <span
        style={{
          background,
          color,
          paddingLeft: "6px",
          paddingRight: "6px",
          borderRadius: "5px",
          marginLeft: "5px",
        }}
      >
        {message}
      </span>
    </>
  );
};

OnRouteBCChip.displayName = "OnRouteBCChip";
