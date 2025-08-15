import { OnRouteBCChip } from "../../../../common/components/chip/OnRouteBCChip";
import "./UserManagementChip.scss";

/**
 * A simple chip component to be displayed beside the permit number.
 */
export const UserManagementChip = () => {
  return (
    <OnRouteBCChip
      message="P"
      hoverText="Pending"
      className="user-management-chip"
    />
  );
};

UserManagementChip.displayName = "UserManagementChip";
