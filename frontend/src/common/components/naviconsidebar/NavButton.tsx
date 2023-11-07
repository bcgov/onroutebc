import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faHome } from "@fortawesome/free-solid-svg-icons";

import "./NavButton.scss";
import { getDefaultRequiredVal } from "../../helpers/util";

export const NavButton = ({
  type,
  additionalClassNames,
  onClick,
}: {
  type: "home" | "report";
  additionalClassNames?: string;
  onClick: () => void;
}) => {
  const additionalClasses = getDefaultRequiredVal("", additionalClassNames);
  const buttonClassName = `nav-button--${type}`;

  const getIcon = () => {
    if (type === "home") {
      return <FontAwesomeIcon icon={faHome} />;
    }

    return <FontAwesomeIcon icon={faFileLines} />;
  };

  const getTitle = () => {
    if (type === "home") {
      return "Home";
    }

    return "Report";
  };

  return (
    <button 
      type="button"
      title={getTitle()}
      className={`nav-button ${buttonClassName} ${additionalClasses}`} 
      onClick={onClick}
    >
      <div className="nav-button__hover-container">
        {getIcon()}
      </div>
    </button>
  );
};
