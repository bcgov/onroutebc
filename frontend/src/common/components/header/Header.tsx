import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "./Header.scss";
import * as routes from "../../../constants/routes";
import { Config } from "../../../config";

export const Header = () => {
  const mediaQuery = "(max-width: 768px)";
  const mediaQueryList: MediaQueryList = window.matchMedia(mediaQuery);
  const [menuOpen, setMenuOpen] = useState(!mediaQueryList.matches);

  // Get the openshift environment name from the url
  // Example:
  // https://onroutebc-99-frontend.apps.silver.devops.gov.bc.ca
  // env = ["-test-", "test"]
  // use env[1] to get "test"
  const getOpenshiftEnv = () => {
    const url = window.location.href;
    const { hostname } = new URL(url);
    const env = hostname.match( '-(.*)-' );

    if (hostname === "localhost") return 'localhost';

    if (env){
      // If the environment is a number then it is in the dev environment
      // The number corresponds to the PR in github
      if (!isNaN(Number(env[1]))){
        return "dev";
      }
      // If isNaN, then it should be 'test', 'prod', or 'uat'
      return env[1];
    }
    return "other";
  }

  let headerColor: string;
  switch (getOpenshiftEnv()) {
    case "test":
      headerColor = "orange";
      break;
    case "uat":
      headerColor = "purple";
      break;
    case "dev":
      headerColor = "green";
      break;
    case "prod":
    case "localhost":
    default:
      headerColor = "#036";
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
