import { Box, Button, Typography } from "@mui/material";

import "./PermitPayFeeSummary.scss";
import { PermitType } from "../../../../types/application";
import { FeeSummary } from "../../../../components/feeSummary/FeeSummary";

export const PermitPayFeeSummary = ({ 
  calculatedFee,
  permitType,
  onPay,
}: { 
  calculatedFee: number;
  permitType?: PermitType;
  onPay: () => void;
}) => {
  return (
    <Box className="permit-pay-fee-summary">
      <Box className="permit-pay-fee-summary__pay">
        <FeeSummary
          permitType={permitType}
          feeSummary={`${calculatedFee}`}
        />

        <Button
          data-testid="pay-now-btn"
          className="permit-pay-fee-summary__pay-btn"
          variant="contained"
          onClick={onPay}
        >
          Pay Now
        </Button>
      </Box>

      <Typography
        className="permit-pay-fee-summary__contact"
        variant="h6"
      >
        Have questions? Please contact the Provincial Permit Centre. Toll-free:
        <span className="pay-contact pay-contact--phone"> 1-800-559-9688</span> or Email:{" "}
        <span className="pay-contact pay-contact--email">ppcpermit@gov.bc.ca</span>
      </Typography>
    </Box>
  );
};
