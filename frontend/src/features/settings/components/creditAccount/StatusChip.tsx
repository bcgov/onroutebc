import {
  CreditAccountStatusType,
  CreditAccountStatusDisplayValues,
  CREDIT_ACCOUNT_STATUS_TYPE,
} from "../../types/creditAccount";
import "./StatusChip.scss";

interface StatusChipProps {
  status: CreditAccountStatusType | "SUSPENDED";
  isVerified: boolean;
}

export const StatusChip = ({ status, isVerified }: StatusChipProps) => {
  const classModifier =
    status !== "SUSPENDED" &&
    CreditAccountStatusDisplayValues[status].toLowerCase().replace(" ", "-");

  if (status === CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE && isVerified) {
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
    <>
      {!isVerified && (
        <span role="status" className="status-chip status-chip--unverified">
          Unverified
        </span>
      )}
      {status !== CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE && (
        <span
          role="status"
          className={`status-chip status-chip--${classModifier}`}
        >
          {CreditAccountStatusDisplayValues[status]}
        </span>
      )}
    </>
  );
};
