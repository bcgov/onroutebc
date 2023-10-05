import { OnRouteBCChip } from "../../../../common/components/table/OnRouteBCChip";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { 
  PERMIT_EXPIRED, 
  PERMIT_STATUSES, 
  isPermitInactive,
} from "../../types/PermitStatus";

/**
 * Returns the colors associated with the badge.
 * NOTE: If the permit is inactive or expired, a small badge has to be displayed
 * beside the permit number.
 * @param permitStatus string representing the permit status
 * @returns An object containing the text and background colors
 */
const getColors = (
  permitStatus?: string
): { background: string; color: string } | undefined => {
  switch (permitStatus) {
    case PERMIT_STATUSES.VOIDED:
      return {
        background: BC_COLOURS.focus_blue,
        color: BC_COLOURS.white,
      };
    case PERMIT_STATUSES.REVOKED:
      return {
        background: BC_COLOURS.bc_messages_red_text,
        color: BC_COLOURS.white,
      };
    case PERMIT_STATUSES.SUPERSEDED:
      return {
        background: BC_COLOURS.bc_border_grey,
        color: BC_COLOURS.bc_black,
      };
    case PERMIT_EXPIRED:
      return {
        background: BC_COLOURS.bc_messages_red_background,
        color: BC_COLOURS.bc_messages_red_text,
      };
    default:
      return undefined;
  }
};

/**
 * Returns the text corresponding to the status of a permit.
 * @param permitStatus string representing the permit status
 * @returns Display text string corresponding to permit status
 */
const getTextForBadge = (permitStatus?: string): string => {
  switch (permitStatus) {
    case PERMIT_STATUSES.VOIDED:
      return "Void";
    case PERMIT_STATUSES.REVOKED:
      return "Revoked";
    case PERMIT_STATUSES.SUPERSEDED:
      return "Superseded";
    case PERMIT_EXPIRED:
      return "Expired";
    default:
      return "";
  }
};

/**
 * A boolean indicating if a small badge has to be displayed beside the Permit Number.
 */
const shouldShowPermitChip = (permitStatus?: string) => {
  return isPermitInactive(permitStatus) || permitStatus === PERMIT_EXPIRED;
};

/**
 * A simple chip component to be displayed beside the permit number.
 */
export const PermitChip = ({
  permitStatus,
}: {
  permitStatus?: string;
}) => {
  if (!shouldShowPermitChip(permitStatus)) {
    return null;
  }

  const chipColours = getColors(permitStatus);
  return chipColours ? (
    <>
      <OnRouteBCChip
        {...chipColours}
        message={getTextForBadge(permitStatus)}
      />
    </>
  ) : null;
};

PermitChip.displayName = "PermitChip";
