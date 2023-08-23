import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./SearchButton.scss";

export const SearchButton = ({
  onClick,
}: {
  onClick: () => void;
}) => {
  return (
    <button 
      className="search-button"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faSearch} />
    </button>
  );
};
