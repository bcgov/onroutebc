import { Optional } from "../../../../common/types/common";
import {
  CreditAccountStatusType,
  CreditAccountStatusDisplayValues,
  CREDIT_ACCOUNT_STATUS_TYPE,
} from "../../types/creditAccount";
import "./StatusChip.scss";

interface StatusChipProps {
  status: CreditAccountStatusType | "SUSPENDED";
  isCreditAccountVerified?: Optional<boolean>;
}

export const StatusChip = ({ status, isCreditAccountVerified }: StatusChipProps) => {
  const classModifier =
    status !== "SUSPENDED" &&
    CreditAccountStatusDisplayValues[status].toLowerCase().replace(" ", "-");

  if (status === CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE && isCreditAccountVerified) {
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
      {!isCreditAccountVerified && (
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
