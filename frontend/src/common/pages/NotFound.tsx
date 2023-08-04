import { Box, Container, Divider, Typography } from "@mui/material";

export const NotFound = () => {
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
          <Typography variant="h4" sx={{ color: "#313132" }}>Page not found</Typography>
        </Box>
        <Box className="success__block success__block--info">
          <Divider/>
          <p style={{ margin: '20px 0'}}>
          <Typography variant="body1" sx={{ color: "#313132"}}>
              Please visit <a href="/">onRoutBC</a>.         
          </Typography>
          </p>
          <Divider/>
        </Box>      
      </Box>
    </Box>
    </Container>
  );
};
