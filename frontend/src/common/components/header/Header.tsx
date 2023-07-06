import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "./Header.scss";
import * as routes from "../../../routes/constants";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { Grid } from "@mui/material";
import { DoesUserHaveRoleWithContext } from "../../authentication/util";
import { ROLES } from "../../authentication/types";
import { Brand } from "./components/Brand";
import { LogoutButton } from "./components/LogoutButton";
import { UserSection } from "./components/UserSection";
import { UserSectionInfo } from "./components/UserSectionInfo";
import { getLoginUsernameFromSession } from "../../apiManager/httpRequestHandler";

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
  const username = getLoginUsernameFromSession();

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

  const NavButton = () => (
    <div className="other">
      <a className="nav-btn" onClick={menuToggleHandler}>
        <FontAwesomeIcon id="menu" className="menu-icon" icon={faBars} />
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
              {DoesUserHaveRoleWithContext(ROLES.WRITE_PERMIT) && (
                <li>
                  <NavLink to={routes.APPLICATIONS} onClick={menuToggleHandler}>
                    Permits
                  </NavLink>
                </li>
              )}
              {DoesUserHaveRoleWithContext(ROLES.READ_VEHICLE) && (
                <li>
                  <NavLink
                    to={routes.MANAGE_VEHICLES}
                    onClick={menuToggleHandler}
                  >
                    Vehicle Inventory
                  </NavLink>
                </li>
              )}
              {DoesUserHaveRoleWithContext(ROLES.READ_ORG) && (
                <li>
                  <NavLink
                    to={routes.MANAGE_PROFILES}
                    onClick={menuToggleHandler}
                  >
                    Profile
                  </NavLink>
                </li>
              )}
            </>
          )}
          {isAuthenticated && (
            <li className="user-section user-section--mobile">
              <UserSectionInfo username={username} />
              <LogoutButton />
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
              <UserSection username={username} />
            )}
          </Grid>
        </Grid>
      </header>
      <Navigation />
    </div>
  );
};
