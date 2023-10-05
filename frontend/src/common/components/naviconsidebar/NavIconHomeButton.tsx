import './NavIconHomeButton.scss'
import { Box, IconButton, Tooltip } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as routes from "../../../routes/constants";

/**
 * Displays the navigation icon for Home on the NavIconSideBar
 */
export const NavIconHomeButton = () => {
    
  const navigate = useNavigate()
  return (
    <div className="nav-icon-home-button">
      <Box sx={{ border: '1px solid #003366', backgroundColor: '#003366', width: '45px' }}>
      <Tooltip arrow placement="left" title="Home">
        <IconButton
          size="medium"
          color="secondary"
          onClick={() => {navigate(routes.HOME)}}
        >
          <Home />
        </IconButton>
      </Tooltip>
      </Box>
    </div>
  )
  }