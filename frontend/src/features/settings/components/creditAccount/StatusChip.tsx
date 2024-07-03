import {
  CreditAccountStatusType,
  CreditAccountStatusDisplayValues,
} from "../../types/creditAccount";
import "./StatusChip.scss";

interface StatusChipProps {
  status: CreditAccountStatusType;
}

export const StatusChip = ({ status }: StatusChipProps) => {
  if (status === "ACTIVE") {
    return;
  }
  return (
    <span
      role="status"
      className={`status-chip status-chip--${CreditAccountStatusDisplayValues[status].toLowerCase().replace(" ", "-")}`}
    >
      {CreditAccountStatusDisplayValues[status]}
    </span>
  );
};
