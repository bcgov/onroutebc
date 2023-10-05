import './NavIconReportButton.scss'
import { Box, IconButton, Tooltip } from "@mui/material";
import { Note } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as routes from "../../../routes/constants";

/**
 * Displays the navigation icon for Reports on the NavIconSideBar
 */
export const NavIconReportButton = () => {
    
    const navigate = useNavigate()

    return (
        <div className="nav-icon-report-button">
        <Box sx={{ border: '1px solid #003366', backgroundColor: '#003366', width: '45px' }}>
            <Tooltip arrow placement="left" title="Reports">
                <IconButton
                    size="medium"
                    color="secondary"
                    onClick={() => {navigate(routes.PERMITS)}}
                >
                    <Note />
                </IconButton>
            </Tooltip>
        </Box>
        </div>
    )
  }