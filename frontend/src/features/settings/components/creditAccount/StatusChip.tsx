import { CreditAccountStatus } from "../../types/creditAccount";
import "./StatusChip.scss";

interface StatusChipProps {
  status: CreditAccountStatus;
}

export const StatusChip = ({ status }: StatusChipProps) => {
  return (
    <span
      role="status"
      className={`status-chip status-chip--${status.toLowerCase().replace(" ", "-")}`}
    >
      {status.toLowerCase()}
    </span>
  );
};
