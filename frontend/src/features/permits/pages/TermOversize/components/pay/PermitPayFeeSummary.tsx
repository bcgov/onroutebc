import { Box, Button, Typography } from "@mui/material";

import "./PermitPayFeeSummary.scss";
import { PermitType } from "../../../../types/PermitType";
import { FeeSummary } from "../../../../components/feeSummary/FeeSummary";
import { PAY_NOW, PPC_EMAIL, TOLL_FREE_HAVE_QUESTIONS, TOLL_FREE_NUMBER } from "../../../../../../common/constants/constants";

export const PermitPayFeeSummary = ({
  calculatedFee,
  isBusy,
  permitType,
  onPay,
}: {
  calculatedFee: number;
  isBusy: boolean;
  permitType?: PermitType;
  onPay: () => void;
}) => {
  return (
    <Box className="permit-pay-fee-summary">
      <Box className="permit-pay-fee-summary__pay">
        <FeeSummary permitType={permitType} feeSummary={`${calculatedFee}`} />

        <Button
          data-testid="pay-now-btn"
          className="permit-pay-fee-summary__pay-btn"
          variant="contained"
          onClick={onPay}
          disabled={isBusy}
        >
          {PAY_NOW}
        </Button>
      </Box>

      <Typography className="permit-pay-fee-summary__contact" variant="h6">
        {TOLL_FREE_HAVE_QUESTIONS}
        <span className="pay-contact pay-contact--phone">
          {" "}
          {TOLL_FREE_NUMBER}
        </span>{" "}
        or Email:{" "}
        <span className="pay-contact pay-contact--email">
          {PPC_EMAIL}
        </span>
      </Typography>
    </Box>
  );
};
