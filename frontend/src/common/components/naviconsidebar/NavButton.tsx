import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./NavButton.scss";
import { getDefaultRequiredVal } from "../../helpers/util";
import {
  NavButtonType,
  getIcon,
  getNavButtonTitle,
} from "./types/NavButtonType";

export const NavButton = ({
  type,
  additionalClassNames,
  onClick,
  isActive,
}: {
  type: NavButtonType;
  additionalClassNames?: string;
  onClick: () => void;
  isActive?: boolean;
}) => {
  const additionalClasses = getDefaultRequiredVal("", additionalClassNames);
  const buttonClassName = `nav-button--${type}`;
  const activeClassName = isActive ? "nav-button--active" : "";

  const icon = getIcon(type);
  const title = getNavButtonTitle(type);
  return (
    <button
      type="button"
      title=""
      className={`nav-button ${buttonClassName} ${additionalClasses} ${activeClassName}`}
      onClick={onClick}
    >
      <div className="nav-button__hover-container">
        {<FontAwesomeIcon icon={icon} />}

        <div className={`nav-button__hover-tooltip`}>
          {title}
        </div>
      </div>
    </button>
  );
};
