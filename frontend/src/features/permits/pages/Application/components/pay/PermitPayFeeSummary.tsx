import { Box, Button } from "@mui/material";

import "./PermitPayFeeSummary.scss";
import { PermitType } from "../../../../types/PermitType";
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
          hideDescriptions={true}
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
    </Box>
  );
};
