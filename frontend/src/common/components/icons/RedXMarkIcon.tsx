import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

/**
 * Reusable red x mark icon.
 */
export const RedXMarkIcon = () => (
  <span>
    <FontAwesomeIcon color={BC_COLOURS.bc_red} icon={faCircleXmark} />
  </span>
);
