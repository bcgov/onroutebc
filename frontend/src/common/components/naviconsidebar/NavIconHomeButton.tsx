import './NavIconHomeButton.scss'
import { IconButton, Tooltip } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as routes from "../../../routes/constants";

/**
 * Displays the navigation icon for Home on the NavIconSideBar
 */
export const NavIconHomeButton = () => {
    
  const navigate = useNavigate()

  return (
      <div className="nav-icon-home-button-container">
        <Tooltip arrow placement="left" title="Home">
          <IconButton
            size="medium"
            color="secondary"
            onClick={() => {navigate(routes.IDIR_WELCOME)}}
          >
            <Home />
          </IconButton>
        </Tooltip>
      </div>
  )
}
