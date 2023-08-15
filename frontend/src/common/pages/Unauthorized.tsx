import { Box, Container, Typography, Divider} from "@mui/material";
import { useAddOrbcError } from "../apiManager/hooks";
import { useEffect } from "react";
import { ERROR_TYPES_ENUM } from "../constants/constants";
import { logError } from "../helpers/errorLogger";

export const Unauthorized = () => {
  const addOrbcError = useAddOrbcError();
  useEffect(() => {
    logError(addOrbcError, ERROR_TYPES_ENUM.UNAUTHORIZED.toString());
  }, []);

  return (
    <Container className="feature-container" sx={{ paddingTop: "24px" }}>

    <Box className="success feature-container">
      <Box className="success__container">
        <Box className="success__block success__block--success-img">
          <img
            height="168"
            width="178"
            src="/Error_Screen_Graphic.svg"
            alt="Profile Set-up Successful"
          />
        </Box>
        <Box className="success__block success__block--success-msg">
          <Typography variant="h4" sx={{ color: "#313132" }}>Unauthorized access</Typography>
        </Box>
        <Box className="success__block success__block--info">

          <Typography variant="body1" sx={{ color: "#313132"}}>
            <div style={{ width: '60%', margin: '0 auto'}}>
              <Divider/>
              <p style={{ margin: '20px 0'}}>
                You do not have the necessary authorization to view this page. Please contact your administrator.
              </p>
              <Divider/>
            </div>        
          </Typography>
        </Box>      
      </Box>
    </Box>
    </Container>
  );
};
