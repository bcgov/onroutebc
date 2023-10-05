import './NavIconReportButton.scss'
import { IconButton, Tooltip } from "@mui/material";
import { Note } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as routes from "../../../routes/constants";

/**
 * Displays the navigation icon for Reports on the NavIconSideBar
 */
export const NavIconReportButton = () => {
    
    const navigate = useNavigate()

    return (
        <div className="nav-icon-report-button-container">
            <Tooltip arrow placement="left" title="Reports">
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