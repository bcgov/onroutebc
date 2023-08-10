import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./SearchButton.scss";

export const SearchButton = () => {
  return (
    <button className="search-button">
      <FontAwesomeIcon icon={faSearch} />
    </button>
  );
};
