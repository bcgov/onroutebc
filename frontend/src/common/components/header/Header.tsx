import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "./Header.scss";
import * as routes from "../../../constants/routes";
import { BC_PRIMARY_BLUE } from "../../../constants/bcGovStyles";
import { Config } from "../../../config";

/*
 * The Header component includes the BC Gov banner and Navigation bar
 * and is responsive for mobile
 * 
 * The banner colour changes based on the Openshift Environment
 * (Dev, Test, UAT, and Prod)
 *
 */
export const Header = () => {
  const mediaQuery = "(max-width: 768px)";
  const mediaQueryList: MediaQueryList = window.matchMedia(mediaQuery);
  const [menuOpen, setMenuOpen] = useState(!mediaQueryList.matches);

  let headerColor: string;
  const env = Config.VITE_DEPLOY_ENVIRONMENT;
  switch (!isNaN(Number(env)) || env) {
    case "test":
      headerColor = "orange";
      break;
    case "uat":
      headerColor = "purple";
      break;
    // if the env is a number, then its in dev
    case true:
      headerColor = "green";
      break;
    case "prod":
    case "localhost":
    default:
      headerColor = BC_PRIMARY_BLUE;
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
