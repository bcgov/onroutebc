import { Box, Container, Typography, Divider} from "@mui/material";
import { useAddOrbcError } from "../apiManager/hooks";
import { useEffect } from "react";
import { generateErrorCorrelationId } from "../helpers/util";
import { getUserSessionDetailsFromSession } from "../apiManager/httpRequestHandler";
import { OrbcError } from "../types/common";
import { ERROR_TYPES_ENUM } from "../constants/constants";

export const UniversalUnauthorized = () => {
    const addOrbcError = useAddOrbcError();
    useEffect(() => {
      const corelationId = generateErrorCorrelationId();
      const userSession = getUserSessionDetailsFromSession();
      const utcTime = new Date().toISOString();
      const orbcError = {
        errorTypeId: ERROR_TYPES_ENUM.UNEXPECTED.toString(),
        errorOccuredTime: utcTime,
        sessionId: userSession.sid,
        userGuid: userSession.bceid_user_guid,
        corelationId: corelationId,
      } as OrbcError;
      addOrbcError.mutateAsync({
        ...orbcError
      });
    
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
            alt="Unauthorized"
          />
        </Box>
        <Box className="success__block success__block--success-msg">
          <Typography variant="h4" sx={{ color: "#313132" }}>Unauthorized access</Typography>
        </Box>
        <Box className="success__block success__block--info">
          <Divider/>
          <p style={{ margin: '20px 0'}}>
          <Typography variant="body1" sx={{ color: "#313132"}}>
            You do not have the necessary authorization to view this page.       
          </Typography>
          </p>
          <Divider/>
        </Box>      
      </Box>
    </Box>
    </Container>
  );
};
