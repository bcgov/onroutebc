import {
  CreditAccountStatusType,
  CreditAccountStatusDisplayValues,
  CREDIT_ACCOUNT_STATUS_TYPE,
} from "../../types/creditAccount";
import "./StatusChip.scss";

interface StatusChipProps {
  status: CreditAccountStatusType | "SUSPENDED";
}

export const StatusChip = ({ status }: StatusChipProps) => {
  const classModifier = CreditAccountStatusDisplayValues[status]
    .toLowerCase()
    .replace(" ", "-");

  if (status === CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE) {
    return;
  }
  if (status === "SUSPENDED") {
    return (
      <span role="status" className="status-chip status-chip--suspended">
        Suspended
      </span>
    );
  }
  return (
    <span role="status" className={`status-chip status-chip--${classModifier}`}>
      {CreditAccountStatusDisplayValues[status]}
    </span>
  );
};
