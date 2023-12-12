import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";

/**
 * Reusable green check icon.
 */
export const GreenCheckIcon = ({ size }: { size?: SizeProp }) => (
  <span>
    <FontAwesomeIcon
      color={BC_COLOURS.bc_green}
      icon={faCircleCheck}
      size={size ?? "lg"}
    />
  </span>
);
