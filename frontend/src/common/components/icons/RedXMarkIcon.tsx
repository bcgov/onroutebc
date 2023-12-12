import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";

/**
 * Reusable red x mark icon.
 */
export const RedXMarkIcon = ({ size }: { size?: SizeProp }) => (
  <span>
    <FontAwesomeIcon
      color={BC_COLOURS.bc_red}
      icon={faCircleXmark}
      size={size ?? "lg"}
    />
  </span>
);
