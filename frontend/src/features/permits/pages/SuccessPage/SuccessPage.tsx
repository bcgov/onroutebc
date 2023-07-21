import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import "./SuccessPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import { downloadPermitApplicationPdf, getPermitTransaction } from "../../apiManager/permitsAPI";

export const SuccessPage = ({
  transactionOrderNumber,
}: {
  transactionOrderNumber?: string;
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { permitId } = useParams();

  const viewPermitPdfByPermitId = async (permitId: number) => {
    try {
      const { blobObj, filename } = await downloadPermitApplicationPdf(permitId);      
      // Create an object URL for the response
      const objUrl = URL.createObjectURL(blobObj);
      const link = document.createElement('a');
      link.href = objUrl;
      link.setAttribute('download', `${filename}`); // Set the desired file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const viewPermitByTransaction = async (transactionOrderNumber?: string) => {
    if (!transactionOrderNumber) {
      console.error("Cannot find transaction order number");
      return;
    }

    try {
      const permitData = await getPermitTransaction(transactionOrderNumber);
      await viewPermitPdfByPermitId(+permitData.permitId);
    } catch (err) {
      console.error(err);
    }
  };

  const viewPermitPdf = async () => {
    if (permitId) {
      return await viewPermitPdfByPermitId(+permitId);
    }
    return await viewPermitByTransaction(transactionOrderNumber);
  };

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
            The permit has been sent to the email/fax
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
            onClick={viewPermitPdf}
          >
            Download Permit
          </Button>
          <Button
            sx={{ marginLeft: "24px" }}
            variant="contained"
            color="secondary"
            disabled={true} // TODO
          >
            TODO: View Receipts
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
