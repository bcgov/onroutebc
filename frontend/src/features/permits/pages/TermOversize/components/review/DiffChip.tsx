import "./DiffChip.scss";

export const DiffChip = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <span className={`diff-chip ${className ? className : ""}`}>
      Changed
    </span>
  );
};
