import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "react-oidc-context";

import "./Header.scss";
import * as routes from "../../../routes/constants";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { Grid } from "@mui/material";

const LogOutBtn = () => {
  const { signoutRedirect, user } = useAuth();

  return (
    <a
      style={{ cursor: "pointer" }}
      onClick={() => {
        sessionStorage.removeItem("onRoutebc.user.context");
        signoutRedirect({
          extraQueryParams: {
            redirect_uri: window.location.origin + "/",
            kc_idp_hint: user?.profile?.identity_provider as string,
          },
        });
      }}
    >
      Log Out
    </a>
  );
};
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
  const { isAuthenticated } = useAuth();

  let headerColor: string;
  const env =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;
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
      headerColor = BC_COLOURS.bc_primary_blue;
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
          alt="Go to the onRouteBC Home Page"
          height="50px"
        />
      </a>
      <h1>onRouteBC</h1>
    </div>
  );

  const NavButton = () => (
    <div className="other">
      <a className="nav-btn" onClick={menuToggleHandler}>
        <i className="fas fa-bars" id="menu"></i>
      </a>
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
          {isAuthenticated && (
            <>
              <li>
                <NavLink
                  to={routes.MANAGE_VEHICLES}
                  onClick={menuToggleHandler}
                >
                  Vehicle Inventory
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={routes.MANAGE_PROFILES}
                  onClick={menuToggleHandler}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to={routes.PERMITS} onClick={menuToggleHandler}>
                  Permits
                </NavLink>
              </li>
            </>
          )}
          {isAuthenticated && (
            <li className={"log-out-txt"}>
              <LogOutBtn />
            </li>
          )}
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
        <Grid container>
          <Grid item xs={10}>
            <Brand />
          </Grid>

          <Grid item xs={2} display="flex" alignItems={"center"}>
            <NavButton />
            {isAuthenticated && (
              <div className="log-out-btn">
                <LogOutBtn />
              </div>
            )}
          </Grid>
        </Grid>
      </header>
      <Navigation />
    </div>
  );
};
