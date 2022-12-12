import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "./Header.scss";
import * as routes from "../../../constants/routes";

export const Header = () => {
  const mediaQuery: string = "(max-width: 768px)";
  const mediaQueryList: MediaQueryList = window.matchMedia(mediaQuery);

  const [headerColor, setHeaderColor] = useState("#036"); // bcgov blue
  const [menuOpen, setMenuOpen] = useState(!mediaQueryList.matches);

  /**
   *
   * On page load, set the colour of the header and
   * add an event listener for screen width for the navbar responsiveness
   *
   */
  useEffect(() => {
    const configureHeaderColor = () => {
      const DEPLOY_ENV: string | undefined =
        process.env.REACT_APP_DEPLOY_ENVIRONMENT;

      let color: string;
      switch (DEPLOY_ENV) {
        case "prod":
          color = "#036";
          break;
        case "test":
          color = "orange";
          break;
        case "uat":
          color = "purple";
          break;
        // Default is the dev environment.
        // DEPLOY_ENV may be 'dev' or a number corresponding to the pull request #, or undefined
        default:
          color = "green";
          break;
      }
      setHeaderColor(color);
    };
    configureHeaderColor();

    const handleResize = () => {
      mediaQueryList.matches ? setMenuOpen(false) : setMenuOpen(true);
    };
    mediaQueryList.addEventListener("change", handleResize);
    return () => mediaQueryList.removeEventListener("change", handleResize);

    // Remove "React Hook useEffect has a missing dependency: 'mediaQueryList'"" warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the window width is under 768px, then toggle visibility, otherwise keep menu visible
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
