import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "./Header.scss";
import { DoesUserHaveAuthGroup, DoesUserHaveRoleWithContext } from "../../authentication/util";
import { Brand } from "./components/Brand";
import { UserSection } from "./components/UserSection";
import { getLoginUsernameFromSession } from "../../apiManager/httpRequestHandler";
import { SearchButton } from "./components/SearchButton";
import { SearchFilter } from "./components/SearchFilter";
import { IDPS } from "../../types/idp";
import OnRouteBCContext from "../../authentication/OnRouteBCContext";
import { getDefaultNullableVal } from "../../helpers/util";
import {
  APPLICATIONS_ROUTES,
  PROFILE_ROUTES,
  SETTINGS_ROUTES,
  VEHICLES_ROUTES,
} from "../../../routes/constants";

import {
  BCeIDUserAuthGroupType,
  IDIRUserAuthGroupType,
  IDIR_USER_AUTH_GROUP,
  ROLES,
} from "../../authentication/types";

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
  userAuthGroup,
}: {
  isAuthenticated: boolean;
  isMobile?: boolean;
  userAuthGroup?: BCeIDUserAuthGroupType | IDIRUserAuthGroupType;
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
              {DoesUserHaveAuthGroup({
                userAuthGroup,
                allowedAuthGroups: [
                  IDIR_USER_AUTH_GROUP.FINANCE,
                  IDIR_USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
                  IDIR_USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
                  // add CTPO later to IDIR_USER_AUTH_GROUP and here as well
                ],
              }) && (
                <li>
                  <NavLink to={SETTINGS_ROUTES.MANAGE}>Settings</NavLink>
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
    <a
      className="nav-btn"
      role="link"
      onClick={toggleMenu}
      onKeyDown={toggleMenu}
      tabIndex={0}
    >
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
  const { companyId, idirUserDetails, userDetails } = useContext(OnRouteBCContext);
  const username = getLoginUsernameFromSession();
  const isIdir = user?.profile?.identity_provider === IDPS.IDIR;
  const authGroup = getDefaultNullableVal(
    idirUserDetails?.userAuthGroup,
    userDetails?.userAuthGroup,
  );

  const shouldDisplayNavBar = Boolean(companyId);

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
      {shouldDisplayNavBar && (
        <Navbar
          isAuthenticated={isAuthenticated}
          userAuthGroup={authGroup}
        />
      )}
      {shouldDisplayNavBar && menuOpen ? (
        <Navbar
          isAuthenticated={isAuthenticated}
          isMobile={true}
          userAuthGroup={authGroup}
        />
      ) : null}
      {filterOpen ? <SearchFilter closeFilter={toggleFilter} /> : null}
    </div>
  );
};
