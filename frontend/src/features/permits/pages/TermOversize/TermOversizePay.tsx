import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import dayjs from "dayjs";

import "./TermOversizePay.scss";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ProgressBar } from "../../components/progressBar/ProgressBar";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";
import { getMotiPayTransactionUrl } from "../../apiManager/permitsAPI";
import { permitTypeDisplayText } from "../../helpers/mappers";
import { feeSummaryDisplayText } from "../../helpers/feeSummary";

export const TermOversizePay = () => {
  const { applicationData } = useContext(ApplicationContext);
  const calculatedFee = feeSummaryDisplayText(
    applicationData?.permitData?.feeSummary, 
    applicationData?.permitData?.permitDuration
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ProgressBar />
      <Box
        className="payment"
        sx={{
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
          minHeight: "calc(100vh - 390px)",
        }}
      >
        <ApplicationSummary />
        <FeeSummary calculatedFee={calculatedFee} />
      </Box>
    </>
  );
};

const ApplicationSummary = () => {
  const { applicationData } = useContext(ApplicationContext);
  const applicationName = permitTypeDisplayText(
    getDefaultRequiredVal("", applicationData?.permitType)
  );

  return (
    <Box
      sx={{
        paddingBottom: "40px",
        borderBottom: `1px solid ${BC_COLOURS.bc_text_box_border_grey}`,
      }}
    >
      <Typography
        variant={"h1"}
        sx={{
          marginRight: "200px",
          marginTop: "0px",
          paddingTop: "0px",
          borderBottom: "none",
        }}
      >
        {applicationName}
      </Typography>
      {applicationData?.applicationNumber &&
      applicationData?.applicationNumber !== "" ? (
        <>
          <Typography
            variant="h2"
            sx={{
              display: "block",
              borderBottom: "none",
              paddingBottom: "8px",
              paddingTop: "8px",
            }}
          >
            Application # {applicationData.applicationNumber}
          </Typography>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};

const FeeSummary = ({ calculatedFee }: { calculatedFee: string }) => {
  const { applicationData } = useContext(ApplicationContext);
  if (!applicationData?.permitId)
    return <ErrorFallback error={"Application data not found"} />;

  // TODO: Use transaction amount
  const transactionAmount = applicationData.permitData.permitDuration;
  const permitIds = [applicationData.permitId];
  const transactionSubmitDate = dayjs().utc().toISOString();
  const paymentMethodId = 1; // TODO: implement payment method (ie payBC, manual, etc)

  const handlePayNow = async () => {
    const url = await getMotiPayTransactionUrl(
      paymentMethodId, 
      transactionSubmitDate, 
      transactionAmount, 
      permitIds
    );
    window.open(url, "_self");
  };

  return (
    <>
      <Box sx={{ maxWidth: "488px" }}>
        <Box
          className="payment--fee-summary"
          sx={{
            backgroundColor: BC_COLOURS.banner_grey,
            color: BC_COLOURS.bc_primary_blue,
            marginTop: "40px",
            marginBottom: "24px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              paddingBottom: "8px",
            }}
          >
            Fee Summary
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px 0",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
              Description
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
              Amount
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px 0",
              borderTop: `2px solid ${BC_COLOURS.bc_text_box_border_grey}`,
              borderBottom: `2px solid ${BC_COLOURS.bc_text_box_border_grey}`,
            }}
          >
            <Typography variant="h6">
              {permitTypeDisplayText(applicationData?.permitType)}
            </Typography>
            <Typography variant="h6">
              {calculatedFee}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "16px",
              marginBottom: "24px",
            }}
          >
            <Typography variant="h4">Total (CAD)</Typography>
            <Typography variant="h4">
              {calculatedFee}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          sx={{ width: "100%" }}
          onClick={handlePayNow}
        >
          Pay Now
        </Button>
      </Box>
      <Typography
        variant="h6"
        sx={{ marginTop: "40px", marginBottom: "173px" }}
      >
        Have questions? Please contact the Provincial Permit Centre. Toll-free:
        <span style={{ fontWeight: "700" }}> 1-800-559-9688</span> or Email:{" "}
        <span style={{ fontWeight: "700" }}>ppcpermit@gov.bc.ca</span>
      </Typography>
    </>
  );
};
