import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./IDIRWelcome.scss";

/**
 * A react component containing the Search PPC Dashboard.
 */
export const IDIRWelcome = () => {
  return (
    <div className="idir-welcome-page">
      <div className="idir-welcome-page__container">
        <div className="graphic"></div>
        <h2 className="welcome-title">Welcome to onRouteBC!</h2>
        <div className="info-message">
          Search for a permit by clicking the search icon{" "}
          <FontAwesomeIcon icon={faSearch} /> at the top of the screen.
        </div>
      </div>
    </div>
  );
};
