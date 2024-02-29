import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import "./DiffChip.scss";

export const DiffChip = ({ className }: { className?: string }) => {
  const additionalClassName = getDefaultRequiredVal("", className);

  return <span className={`diff-chip ${additionalClassName}`}>Changed</span>;
};
