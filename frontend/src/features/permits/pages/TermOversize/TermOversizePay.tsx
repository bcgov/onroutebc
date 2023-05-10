import { Box, Button, Radio, Typography } from "@mui/material";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ProgressBar } from "../../components/progressBar/ProgressBar";
import "./TermOversize.scss";

export const TermOversizePay = () => {
  const { applicationData } = useContext(ApplicationContext);
  const calculatedFee = applicationData?.application.permitDuration || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedPaymentType, setSelectedPaymentType] = useState("payBC");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentType(event.target.value);
  };

  const PayBC = () => {
    return (
      <Box className="payment-option-box">
        <Box display="flex" alignItems="center">
          <Radio
            disableRipple
            checked={selectedPaymentType === "payBC"}
            onChange={handleChange}
            value="payBC"
            name="radio-buttons"
            inputProps={{ "aria-label": "PayBC" }}
            sx={{
              "& .MuiSvgIcon-root": {
                fontSize: 24,
              },
            }}
          />
          <Typography
            sx={{
              marginRight: "-4px",
              fontWeight: "fontWeightBold",
              fontSize: "19px",
            }}
          >
            Use
          </Typography>
          <img className="payment-img-payBC" src="./PayBC-Main-Logo.png" />
          <Box
            sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
          >
            <img className="payment-img" src="./Visa_Logo.svg" />
            <img className="payment-img" src="./Mastercard_Logo.svg" />
            <img className="payment-img" src="./Amex_Logo.svg" />
          </Box>
        </Box>

        <Typography sx={{ paddingLeft: "9px" }}>
          A convenient, secure and easy way to pay for BC Government Services
          online.
        </Typography>
      </Box>
    );
  };

  const ApplicationSummary = () => {
    return (
      <Box
        className="payment-fee-summary"
        sx={{
          backgroundColor: BC_COLOURS.bc_black,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            paddingBottom: "8px",
            color: BC_COLOURS.white,
          }}
        >
          Oversize: Term
        </Typography>
        <Typography
          variant="h6"
          sx={{
            paddingBottom: "4px",
            color: BC_COLOURS.white,
          }}
        >
          Application #:
        </Typography>
      </Box>
    );
  };

  const FeeSummary = () => {
    return (
      <Box
        className="payment-fee-summary"
        sx={{
          backgroundColor: BC_COLOURS.banner_grey,
          color: BC_COLOURS.bc_primary_blue,
          marginBottom: "218px",
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
            Price ($CAD)
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
          <Typography variant="h6">Oversize: Term</Typography>
          <Typography variant="h6">${calculatedFee}.00</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "16px",
            marginBottom: "24px",
          }}
        >
          <Typography variant="h4">Total</Typography>
          <Typography variant="h4">${calculatedFee}.00</Typography>
        </Box>

        <Button variant="contained" sx={{ width: "100%" }}>
          Pay Now
        </Button>

        <Typography variant="h6" sx={{ marginTop: "24px" }}>
          Have questions? Please contact the Provincial Permit Centre.
          Toll-free: 1-800-559-9688 or Email: ppcpermit@gov.bc.ca
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <ProgressBar />
      <Box
        className="payment-layout"
        sx={{
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
          display: "flex",
        }}
      >
        <Box className="payment-option-container">
          <PayBC />
        </Box>

        <Box sx={{ marginLeft: "auto" }}>
          <ApplicationSummary />
          <FeeSummary />
        </Box>
      </Box>
    </>
  );
};
