import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import "./SuccessPage.scss";
import { useNavigate } from "react-router-dom";
import { ApplicationContext } from "../../context/ApplicationContext";
import { viewPermitApplicationPdf } from "../../apiManager/permitsAPI";

export const SuccessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();


  const applicationContext = useContext(ApplicationContext);
  const viewPermitPdf = async () => {
    const permitId = applicationContext.applicationData?.permitId as number;
    // const dmsRef = viewPermitApplicationPdf(permitId).then(response => response);
    const dmsRef = "/CVSE1000.pdf"
    window.open(await dmsRef, '_blank');
  }

  return (
    <Box className="success feature-container">
      <Box className="success__container">
        <Box className="success__block success__block--success-img">
          <img
            height="168"
            width="178"
            src="/Success_Graphic.png"
            alt="Profile Set-up Successful"
          />
        </Box>
        <Box className="success__block success__block--success-msg">
          <Typography variant="h4">Success</Typography>
        </Box>
        <Box className="success__block success__block--info">
          <Typography variant="body1">
            TODO: The permit(s) and receipt have been sent to the email/fax
            provided.
          </Typography>
        </Box>
        <Box className="success__block success__block--apply-permit">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/applications")}
          >
            Apply for a new permit
          </Button>
        </Box>
        <Box className="success__block success__block--view-permits">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              viewPermitPdf();
            }}
          >
            View Permits
          </Button>
          <Button
            sx={{ marginLeft: "24px" }}
            variant="contained"
            color="secondary"
          >
            View Receipts
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
