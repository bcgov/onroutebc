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
}: {
  type: NavButtonType;
  additionalClassNames?: string;
  onClick: () => void;
}) => {
  const additionalClasses = getDefaultRequiredVal("", additionalClassNames);
  const buttonClassName = `nav-button--${type}`;

  const icon = getIcon(type);
  const title = getNavButtonTitle(type);

  return (
    <button
      type="button"
      title={title}
      className={`nav-button ${buttonClassName} ${additionalClasses}`}
      onClick={onClick}
    >
      <div className="nav-button__hover-container">
        {<FontAwesomeIcon icon={icon} />}
      </div>
    </button>
  );
};
