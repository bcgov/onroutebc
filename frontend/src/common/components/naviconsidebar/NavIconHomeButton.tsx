import './NavIconHomeButton.scss'
import { IconButton, Tooltip } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as routes from "../../../routes/constants";
import { useTranslation } from "react-i18next";

/**
 * Displays the navigation icon for Home on the NavIconSideBar
 */
export const NavIconHomeButton = () => {
    
  const navigate = useNavigate()
  const translationPrefix = 'navigation.button-bar'
  const { t } = useTranslation()

  return (
      <div className="nav-icon-home-button-container">
        <Tooltip arrow placement="left" title={t(`${translationPrefix}.home-button`)}>
          <IconButton
            size="medium"
            color="secondary"
            onClick={() => {navigate(routes.HOME)}}
          >
            <Home />
          </IconButton>
        </Tooltip>
      </div>
  )
}
