import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "./Header.scss";
import * as routes from "../../../constants/routes";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

interface IListItemProps {
  path: string;
  label: string;
}

export const Header = () => {
  const TOGGLE_WIDTH = 768;
  const { innerWidth } = window;
  // Show or hide the dropdown which shows the nav links
  // Do not show the dropdown on initial page load if screen size is small
  const [showDropdownMenu, setToggleMenu] = useState(() => {
    return innerWidth < TOGGLE_WIDTH;
  });

  const getWindowWidth = () => {
    return window.innerWidth;
  };

  const toggleDropdown = () => {
    if (getWindowWidth() < TOGGLE_WIDTH) {
      setToggleMenu(!showDropdownMenu);
    }
  };

  // Add event listener when user changes the width of the window
  // Hide the dropdown menu when width changes
  useEffect(() => {
    const onWidthChanged = () => {
      setToggleMenu(getWindowWidth() < TOGGLE_WIDTH);
    };
    window.addEventListener("resize", onWidthChanged);
    return () => {
      window.removeEventListener("resize", onWidthChanged);
    };
  }, []);

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
      <button className="nav-btn" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );

  const ListItem = ({ path, label } : IListItemProps ) => (
    <li>
      <NavLink to={path} onClick={toggleDropdown}>
        {label}
      </NavLink>
    </li>
  );

  const Navigation = () => (
    <nav
      className="navigation-main"
      id="navbar"
      style={{ display: !showDropdownMenu ? "block" : "none" }}
    >
      <div className="list-container">
        <ul>
          <ListItem path={routes.HOME} label="Home"/>
          <ListItem path={routes.MANAGE_VEHICLES} label="Manage Vehicles"/>
        </ul>
      </div>
    </nav>
  );

  return (
    <div className="nav-container">
      <header>
        <Brand />
        <NavButton />
      </header>
      <Navigation />
    </div>
  );
};
