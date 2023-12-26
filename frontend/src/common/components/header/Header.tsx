import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "./Header.scss";
import { DoesUserHaveRoleWithContext } from "../../authentication/util";
import { ROLES } from "../../authentication/types";
import { Brand } from "./components/Brand";
import { UserSection } from "./components/UserSection";
import { getLoginUsernameFromSession } from "../../apiManager/httpRequestHandler";
import { SearchButton } from "./components/SearchButton";
import { SearchFilter } from "./components/SearchFilter";
import { IDPS } from "../../types/idp";
import OnRouteBCContext from "../../authentication/OnRouteBCContext";
import {
  APPLICATIONS_ROUTES,
  PROFILE_ROUTES,
  VEHICLES_ROUTES,
} from "../../../routes/constants";

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

const Navbar = ({
  isAuthenticated,
  isMobile = false,
}: {
  isAuthenticated: boolean;
  isMobile?: boolean;
}) => {
  const navbarClassName = isMobile ? "mobile" : "normal";
  return (
    <nav className={`navbar navbar--${navbarClassName}`}>
      <div className="navbar__links">
        <ul>
          {isAuthenticated && (
            <>
              {DoesUserHaveRoleWithContext(ROLES.WRITE_PERMIT) && (
                <li>
                  <NavLink to={APPLICATIONS_ROUTES.BASE}>Permits</NavLink>
                </li>
              )}
              {DoesUserHaveRoleWithContext(ROLES.READ_VEHICLE) && (
                <li>
                  <NavLink to={VEHICLES_ROUTES.MANAGE}>
                    Vehicle Inventory
                  </NavLink>
                </li>
              )}
              {DoesUserHaveRoleWithContext(ROLES.READ_ORG) && (
                <li>
                  <NavLink to={PROFILE_ROUTES.MANAGE}>Profile</NavLink>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

/**
 * Navigation button react component.
 */
const NavButton = ({ toggleMenu }: { toggleMenu: () => void }) => (
  <div className="other">
    <a className="nav-btn" onClick={toggleMenu} onKeyDown={toggleMenu}>
      <FontAwesomeIcon id="menu" className="menu-icon" icon={faBars} />
    </a>
  </div>
);

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
  const { isAuthenticated, user } = useAuth();
  const { userDetails } = useContext(OnRouteBCContext);
  const username = getLoginUsernameFromSession();
  const isIdir = user?.profile?.identity_provider === IDPS.IDIR;

  const shouldDisplayNavBar =
    !isIdir && Boolean(Object.keys(userDetails ?? {}).length);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setFilterOpen(false);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
    setMenuOpen(false);
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
              {isIdir ? <SearchButton onClick={toggleFilter} /> : null}
              <UserSection username={username} />
            </div>
          ) : null}
          {isAuthenticated ? <NavButton toggleMenu={toggleMenu} /> : null}
        </div>
      </header>
      {shouldDisplayNavBar && <Navbar isAuthenticated={isAuthenticated} />}
      {shouldDisplayNavBar && menuOpen ? (
        <Navbar isAuthenticated={isAuthenticated} isMobile={true} />
      ) : null}
      {filterOpen ? <SearchFilter /> : null}
    </div>
  );
};
