import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "./Header.scss";
import * as routes from "../../../routes/constants";
import { DoesUserHaveRoleWithContext } from "../../authentication/util";
import { ROLES } from "../../authentication/types";
import { Brand } from "./components/Brand";
import { LogoutButton } from "./components/LogoutButton";
import { UserSection } from "./components/UserSection";
import { UserSectionInfo } from "./components/UserSectionInfo";
import { getLoginUsernameFromSession } from "../../apiManager/httpRequestHandler";
import { SearchButton } from "./components/SearchButton";
import { SearchFilter } from "./components/SearchFilter";

const getEnv = () => {
  const env =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;
  
  switch (!isNaN(Number(env)) || env) {
    case "test":
      return "test";
    case "uat":
      return "uat";
    // if the env is a number, then its in dev
    case true:
      return "dev";
    case "prod":
    case "localhost":
    default:
      return "default";
  }
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const username = getLoginUsernameFromSession();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setFilterOpen(false);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
    setMenuOpen(false);
  };

  const NavButton = () => (
    <div className="other">
      <a className="nav-btn" onClick={toggleMenu}>
        <FontAwesomeIcon id="menu" className="menu-icon" icon={faBars} />
      </a>
    </div>
  );

  const Navbar = ({
    isMobile = false,
  }: {
    isMobile?: boolean;
  }) => {
    const navbarClassName = isMobile ? "mobile" : "normal";
    return (
      <nav
        className={`navbar navbar--${navbarClassName}`}
      >
        <div className="navbar__links">
          <ul>
            <li>
              <NavLink to={routes.HOME}>
                Home
              </NavLink>
            </li>
            {isAuthenticated && (
              <>
                {DoesUserHaveRoleWithContext(ROLES.WRITE_PERMIT) && (
                  <li>
                    <NavLink to={routes.APPLICATIONS}>
                      Permits
                    </NavLink>
                  </li>
                )}
                {DoesUserHaveRoleWithContext(ROLES.READ_VEHICLE) && (
                  <li>
                    <NavLink to={routes.MANAGE_VEHICLES}>
                      Vehicle Inventory
                    </NavLink>
                  </li>
                )}
                {DoesUserHaveRoleWithContext(ROLES.READ_ORG) && (
                  <li>
                    <NavLink to={routes.MANAGE_PROFILES}>
                      Profile
                    </NavLink>
                  </li>
                )}
              </>
            )}
            {isAuthenticated && (
              <li className={`user-section user-section--${navbarClassName}`}>
                <UserSectionInfo username={username} />
                <LogoutButton />
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  };

  return (
    <div className="header">
      <header
        className={`header__main header__main--${getEnv()}`}
        data-testid="header-background"
      >
        <div className="brand-section">
          <Brand />
        </div>
        <div className="options-section">
          {isAuthenticated ? (
            <div className="auth-section">
              <SearchButton onClick={toggleFilter} />
              <UserSection username={username} />
            </div>
          ) : null}
          <NavButton />
        </div>
      </header>
      <Navbar />
      {menuOpen ? (
        <Navbar isMobile={true} />
      ) : null}
      {filterOpen ? (
        <SearchFilter />
      ) : null}
    </div>
  );
};
