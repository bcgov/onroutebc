import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "./Header.scss";
import * as routes from "../../../constants/routes";
import { Config } from "../../../config";

export const Header = () => {
  const mediaQuery = "(max-width: 768px)";
  const mediaQueryList: MediaQueryList = window.matchMedia(mediaQuery);
  const [menuOpen, setMenuOpen] = useState(!mediaQueryList.matches);


  const DEPLOY_ENV = Config.VITE_DEPLOY_ENVIRONMENT;

  let headerColor: string;
  switch (DEPLOY_ENV) {
    case "prod":
      headerColor = "#036";
      break;
    case "test":
      headerColor = "orange";
      break;
    case "uat":
      headerColor = "purple";
      break;
    // Default is the dev environment.
    // DEPLOY_ENV may be 'dev' or a number corresponding to the pull request #, or undefined
    default:
      headerColor = "green";
      break;
  }

  // Add event handler to check when the browser screen size changes
  useEffect(() => {
    const handleResize = () => {
      mediaQueryList.matches ? setMenuOpen(false) : setMenuOpen(true);
    };
    mediaQueryList.addEventListener("change", handleResize);
    return () => mediaQueryList.removeEventListener("change", handleResize);
  }, [mediaQueryList]);

  // If the window width is under the mediaquery width, then toggle visibility, otherwise keep menu visible
  const menuToggleHandler = useCallback(() => {
    if (mediaQueryList.matches) {
      setMenuOpen((toggle) => !toggle);
    }
  }, [mediaQueryList]);

  const Brand = () => (
    <div className="banner">
      <a href={routes.HOME}>
        <img
          src="https://developer.gov.bc.ca/static/BCID_H_rgb_rev-20eebe74aef7d92e02732a18b6aa6bbb.svg"
          alt="Go to the onRouteBc Home Page"
          height="50px"
        />
      </a>
      <h1>onRouteBc</h1>
    </div>
  );

  const NavButton = () => (
    <div className="other">
      <button className="nav-btn" onClick={menuToggleHandler}>
        <i className="fa fa-bars"></i>
      </button>
    </div>
  );

  const Navigation = () => (
    <nav
      className="navigation-main"
      style={{ display: menuOpen ? "block" : "none" }}
    >
      <div className="list-container">
        <ul>
          <li>
            <NavLink to={routes.HOME} onClick={menuToggleHandler}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to={routes.MANAGE_VEHICLES} onClick={menuToggleHandler}>
              Manage Vehicles
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );

  return (
    <div className="nav-container">
      <header
        style={{ backgroundColor: headerColor }}
        data-testid="header-background"
      >
        <Brand />
        <NavButton />
      </header>
      <Navigation />
    </div>
  );
};
