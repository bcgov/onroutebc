import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./SearchPage.scss";

export const SearchPage = () => {
  return (
    <div className="search-page">
      <div className="search-page__container">
        <div className="graphic"></div>
        <h2 className="welcome-title">
          Welcome to onRouteBC!
        </h2>
        <div className="info-message">
          Search for a permit by clicking the 
          search icon <FontAwesomeIcon icon={faSearch} /> at 
          the top of the screen.
        </div>
      </div>
    </div>
  );
};
