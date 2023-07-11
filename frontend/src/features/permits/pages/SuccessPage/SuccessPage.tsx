import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import "./SuccessPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import { downloadPermitApplicationPdf } from "../../apiManager/permitsAPI";

export const SuccessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { permitId } = useParams();

  const viewPermitPdf = async (permitId: number | undefined) => {
    await downloadPermitApplicationPdf(permitId).then((response) => {
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.+)/);
        if (filenameMatch && filenameMatch.length === 2) {
          const filename = filenameMatch[1];
          const binaryString = atob(response.data);//Convert base64 string to binary data
          const binaryLen = binaryString.length;
          const bytes = new Uint8Array(binaryLen);

          for (let i = 0; i < binaryLen; i++) {
            const ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
          }

          const blob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${filename}`); // Set the desired file name
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

    });
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
            onClick={() => {
              viewPermitPdf(permitId as number | undefined).catch((err) => {
                console.log(err);
              });
            }}
            disabled={true} // TODO
          >
            TODO: Download Permit
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
