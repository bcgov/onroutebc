import { BC_COLOURS } from "../../../../themes/bcGovStyles";

/**
 * A simple chip component to be displayed beside the permit number.
 */
export const UserManagementChip = () => {
  return (
    <>
      <span
        style={{
          background: BC_COLOURS.bc_messages_gold_background,
          color: BC_COLOURS.bc_brown,
          paddingLeft: "6px",
          paddingRight: "6px",
          borderRadius: "5px",
          marginLeft: "5px",
        }}
      >
        Pending
      </span>
    </>
  );
};

UserManagementChip.displayName = "UserManagementChip";
