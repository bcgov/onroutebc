import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./SuccessPage.scss";
import { viewPermitPdf, viewReceiptPdf } from "../../helpers/permitPDFHelper";
import { APPLICATIONS_ROUTES } from "../../../../routes/constants";

export const SuccessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { permitId } = useParams();

  const viewPermits = async () => {
    if (permitId) {
      return await viewPermitPdf(permitId);
    }
  };

  const viewReceipt = async () => {
    if (permitId) {
      return await viewReceiptPdf(permitId);
    }
  };

  return (
    <Box className="success">
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
          Success
        </Box>
        <Box className="success__block success__block--info">
          The permit(s) and receipt have been sent to the email/fax provided.
        </Box>
        <Box className="success__block success__block--apply-permit">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(APPLICATIONS_ROUTES.BASE)}
            className="success-btn"
          >
            Apply for a new permit
          </Button>
        </Box>
        <Box className="success__block success__block--view-permits">
          <Button
            variant="contained"
            color="tertiary"
            onClick={viewPermits}
            disabled={!permitId}
            className="success-btn success-btn--view-permits"
          >
            View Permits
          </Button>
          <Button
            className="success-btn success-btn--view-receipt"
            variant="contained"
            color="tertiary"
            onClick={viewReceipt}
            disabled={!permitId}
          >
            View Receipt
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
