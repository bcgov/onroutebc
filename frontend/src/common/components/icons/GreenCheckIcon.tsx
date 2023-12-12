import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

/**
 * Reusable green check icon.
 */
export const GreenCheckIcon = () => (
  <span>
    <FontAwesomeIcon color={BC_COLOURS.bc_green} icon={faCircleCheck} />
  </span>
);
