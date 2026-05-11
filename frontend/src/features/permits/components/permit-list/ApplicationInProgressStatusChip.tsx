import "./ApplicationInProgressStatusChip.scss";
import { OnRouteBCChip } from "../../../../common/components/chip/OnRouteBCChip";
import {
  CASE_ACTIVITY_TYPES,
  CaseActivityType,
} from "../../../queue/types/CaseActivityType";

/**
 * Returns the theme name for the chip based on the application Queue Resolution.
 * If the permit is inactive or expired, a chip has to be displayed
 * beside the permit number.
 * Current scope of application queue resolutions that require chips is limited to Rejected.
 * @param applicationQueueResolution string representing the application queue resolution
 * @returns A string representing the theme name for the chip
 */
const getTheme = (applicationQueueResolution?: CaseActivityType) => {
  switch (applicationQueueResolution) {
    case CASE_ACTIVITY_TYPES.REJECTED:
      return "rejected";
    case CASE_ACTIVITY_TYPES.WITHDRAWN:
      return undefined;
    case CASE_ACTIVITY_TYPES.APPROVED:
      return undefined;
    default:
      return undefined;
  }
};

/**
 * Returns the text corresponding to the status of a permit.
 * @param applicationQueueResolution string representing the application queue resolution
 * @returns Display text string corresponding to application queue resolution
 */
const getStatusText = (
  applicationQueueResolution?: CaseActivityType,
): string => {
  switch (applicationQueueResolution) {
    case CASE_ACTIVITY_TYPES.REJECTED:
      return "Rejected";
    case CASE_ACTIVITY_TYPES.WITHDRAWN:
      return "Withdrawn";
    case CASE_ACTIVITY_TYPES.APPROVED:
      return "Approved";
    default:
      return "";
  }
};

/**
 * Returns the text corresponding to the status of a permit.
 * @param applicationQueueResolution string representing the application queue resolution
 * @returns Display text string corresponding to application queue resolution
 */
const getAbbreviatedStatusText = (
  applicationQueueResolution?: CaseActivityType,
): string => {
  switch (applicationQueueResolution) {
    case CASE_ACTIVITY_TYPES.REJECTED:
      return "R";
    case CASE_ACTIVITY_TYPES.WITHDRAWN:
      return "W";
    case CASE_ACTIVITY_TYPES.APPROVED:
      return "A";
    default:
      return "";
  }
};

/**
 * A simple chip component to be displayed beside the permit number.
 */
export const ApplicationInProgressStatusChip = ({
  applicationQueueResolution,
}: {
  applicationQueueResolution?: CaseActivityType;
}) => {
  const chipTheme = getTheme(applicationQueueResolution);
  return chipTheme ? (
    <OnRouteBCChip
      className={`permit-chip permit-chip--${chipTheme}`}
      message={getAbbreviatedStatusText(applicationQueueResolution)}
      hoverText={getStatusText(applicationQueueResolution)}
    />
  ) : null;
};

ApplicationInProgressStatusChip.displayName = "ApplicationInProgressStatusChip";
