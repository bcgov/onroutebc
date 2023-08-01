import { BC_COLOURS } from "../../../../themes/bcGovStyles";

type EXPIRED_PERMIT_STATUS = "VOIDED" | "REVOKED" | "EXPIRED";

/**
 * Returns the colors associated with the badge.
 * NOTE: If the permit status is one of VOIDED or REVOKED, a small badge has to be displayed
 * beside the permit number.
 * @param permitStatus One of "VOIDED" | "REVOKED" | "EXPIRED"
 * @returns An object containing the text and background colors
 */
const getColors = (
  permitStatus: EXPIRED_PERMIT_STATUS
): { background: string; color: string } => {
  switch (permitStatus) {
    case "VOIDED":
      return {
        background: BC_COLOURS.focus_blue,
        color: BC_COLOURS.white,
      };
    case "REVOKED":
      return {
        background: BC_COLOURS.bc_messages_red_text,
        color: BC_COLOURS.white,
      };
    case "EXPIRED":
      return {
        background: BC_COLOURS.bc_messages_red_background,
        color: BC_COLOURS.bc_messages_red_text,
      };
  }
};

/**
 * Returns the text corresponding to a
 * @param permitStatus One of "VOIDED" | "REVOKED" | "EXPIRED"
 * @returns
 */
const getTextForBadge = (permitStatus: EXPIRED_PERMIT_STATUS): string => {
  switch (permitStatus) {
    case "VOIDED":
      return "Void";
    case "REVOKED":
      return "Revoked";
    case "EXPIRED":
      return "Expired";
    default:
      return "";
  }
};

/**
 * A simple chip component to be displayed beside the permit number.
 */
export const PermitChip = ({
  permitStatus,
}: {
  permitStatus: EXPIRED_PERMIT_STATUS;
}) => {
  return (
    <>
      <span
        style={{
          ...getColors(permitStatus),
          paddingLeft: "6px",
          paddingRight: "6px",
          borderRadius: "5px",
          marginLeft: "5px",
        }}
      >
        {getTextForBadge(permitStatus)}
      </span>
    </>
  );
};

PermitChip.displayName = "PermitChip";
