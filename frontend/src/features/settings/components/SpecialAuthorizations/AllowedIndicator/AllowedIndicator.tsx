import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./AllowedIndicator.scss";

export const AllowedIndicator = () => {
  return (
    <div className="allowed-indicator">
      <FontAwesomeIcon
        icon={faCircleCheck}
        className="allowed-indicator__icon"
      />

      <span className="allowed-indicator__label">
        Allowed
      </span>
    </div>
  );
};
