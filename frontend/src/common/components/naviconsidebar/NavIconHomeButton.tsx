
import { useNavigate } from "react-router-dom";

import * as routes from "../../../routes/constants";
import { NavButton } from "./NavButton";

/**
 * Displays the navigation icon for Home on the NavIconSideBar
 */
export const NavIconHomeButton = () => {
  const navigate = useNavigate();

  return (
    <NavButton 
      type="home" 
      onClick={() => navigate(routes.IDIR_WELCOME)} 
    />
  );
}
