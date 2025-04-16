import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "./Header.scss";
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
  SETTINGS_ROUTES,
  VEHICLES_ROUTES,
} from "../../../routes/constants";
import { RenderIf } from "../reusable/RenderIf";
import OutageBanner from "../../../features/public/components/OutageBanner";
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
              <RenderIf
                component={
                  <li>
                    <NavLink to={APPLICATIONS_ROUTES.BASE}>Permits</NavLink>
                  </li>
                }
                permissionMatrixKeys={{
                  permissionMatrixFeatureKey: "MANAGE_PERMITS",
                  permissionMatrixFunctionKey: "VIEW_PERMITS_SCREEN",
                }}
              />
              <RenderIf
                component={
                  <li>
                    <NavLink to={VEHICLES_ROUTES.MANAGE}>
                      Vehicle Inventory
                    </NavLink>
                  </li>
                }
                permissionMatrixKeys={{
                  permissionMatrixFeatureKey: "MANAGE_VEHICLE_INVENTORY",
                  permissionMatrixFunctionKey: "VIEW_VEHICLE_INVENTORY_SCREEN",
                }}
              />
              <RenderIf
                component={
                  <li>
                    <NavLink to={PROFILE_ROUTES.MANAGE}>Profile</NavLink>
                  </li>
                }
                permissionMatrixKeys={{
                  permissionMatrixFeatureKey: "MANAGE_PROFILE",
                  permissionMatrixFunctionKey: "VIEW_COMPANY_INFORMATION",
                }}
              />
              <RenderIf
                component={
                  <li>
                    <NavLink to={SETTINGS_ROUTES.MANAGE}>Settings</NavLink>
                  </li>
                }
                permissionMatrixKeys={{
                  permissionMatrixFeatureKey: "MANAGE_SETTINGS",
                  permissionMatrixFunctionKey: "VIEW_SPECIAL_AUTHORIZATIONS",
                }}
              />
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
  const { companyId } = useContext(OnRouteBCContext);

  const username = getLoginUsernameFromSession();
  const isIdir = user?.profile?.identity_provider === IDPS.IDIR;
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
      <OutageBanner />
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
      {filterOpen ? <SearchFilter closeFilter={toggleFilter} /> : null}
    </div>
  );
};
