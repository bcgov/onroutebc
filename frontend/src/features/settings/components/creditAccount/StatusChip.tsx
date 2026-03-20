import { OnRouteBCChip } from "../../../../common/components/chip/OnRouteBCChip";
import {
  CreditAccountStatusType,
  CreditAccountStatusDisplayValues,
  CREDIT_ACCOUNT_STATUS_TYPE,
} from "../../types/creditAccount";
import "./StatusChip.scss";

interface StatusChipProps {
  status: CreditAccountStatusType | "SUSPENDED" | "UNVERIFIED";
}

export const StatusChip = ({ status }: StatusChipProps) => {
  const classModifier =
    status !== "SUSPENDED" &&
    status !== "UNVERIFIED" &&
    CreditAccountStatusDisplayValues[status].toLowerCase().replace(" ", "-");

  if (status === CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE) {
    return;
  }
  if (status === "SUSPENDED") {
    return (
      <OnRouteBCChip
        className="status-chip status-chip--suspended"
        message="S"
        hoverText="Suspended"
      />
    );
  }
  if (status === "UNVERIFIED") {
    return (
      <span role="status" className="status-chip status-chip--unverified">
        Unverified
      </span>
    );
  }

  return (
    <span role="status" className={`status-chip status-chip--${classModifier}`}>
      {CreditAccountStatusDisplayValues[status]}
    </span>
  );
};
