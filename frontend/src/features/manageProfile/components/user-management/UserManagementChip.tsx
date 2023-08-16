import { OnRouteBCChip } from "../../../../common/components/table/OnRouteBCChip";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";

/**
 * A simple chip component to be displayed beside the permit number.
 */
export const UserManagementChip = () => {
  return (
    <OnRouteBCChip
      background={BC_COLOURS.bc_messages_gold_background}
      color={BC_COLOURS.bc_brown}
      message="Pending"
    />
  );
};

UserManagementChip.displayName = "UserManagementChip";
