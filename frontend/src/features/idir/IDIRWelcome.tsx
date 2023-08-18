import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

/**
 * A react component containing the Search PPC Dashboard.
 */
export const IDIRWelcome = () => {
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <div className="welcome-page">
        <div className="welcome-page__main">
          <div className="welcome-page__header">
            <div className="welcome-graphic"></div>
            <h2>Welcome to onRouteBC!</h2>
          </div>
          <div className="separator-line"></div>
          <div className="welcome-page__company-info">
            <div>
              Search for a permit by clicking the search icon{" "}
              <FontAwesomeIcon icon={faMagnifyingGlass} /> at the top of the
              screen.
            </div>
          </div>
          <div className="separator-line"></div>
        </div>
      </div>
    </>
  );
};