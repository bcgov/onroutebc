import "./ApplicationInProgressStatusChip.scss";
import { OnRouteBCChip } from "../../../../common/components/chip/OnRouteBCChip";
import { Nullable } from "../../../../common/types/common";

/**
 * A simple chip component to be displayed beside the permit number.
 */
export const ApplicationInProgressStatusChip = ({
  isRejectedApplication,
}: {
  isRejectedApplication?: Nullable<boolean>;
}) => {
  return isRejectedApplication ? (
    <OnRouteBCChip
      className={`permit-chip permit-chip--rejected`}
      message={"R"}
      hoverText={"Rejected"}
    />
  ) : null;
};

ApplicationInProgressStatusChip.displayName = "ApplicationInProgressStatusChip";
