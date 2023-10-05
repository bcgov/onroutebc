import './NavIconReportButton.scss'
import { IconButton, Tooltip } from "@mui/material";
import { Note } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as routes from "../../../routes/constants";
import { useTranslation } from "react-i18next";

/**
 * Displays the navigation icon for Reports on the NavIconSideBar
 */
export const NavIconReportButton = () => {
    
    const navigate = useNavigate()
    const translationPrefix = 'navigation.button-bar'
    const { t } = useTranslation()

    return (
        <div className="nav-icon-report-button-container">
            <Tooltip arrow placement="left" title={t(`${translationPrefix}.report-button`)}>
                <IconButton
                    size="medium"
                    color="secondary"
                    onClick={() => {navigate(routes.PERMITS)}}
                >
                    <Note />
                </IconButton>
            </Tooltip>
        </div>
    )
}