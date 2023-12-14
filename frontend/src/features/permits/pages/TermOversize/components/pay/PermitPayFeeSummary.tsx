import { Box, Button, Typography } from "@mui/material";

import "./PermitPayFeeSummary.scss";
import { PermitType } from "../../../../types/PermitType";
import { FeeSummary } from "../../../../components/feeSummary/FeeSummary";
import { DEBOUNCE_TIMEOUT, PAY_NOW, PPC_EMAIL, TOLL_FREE_HAVE_QUESTIONS, TOLL_FREE_NUMBER } from "../../../../../../common/constants/constants";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export const PermitPayFeeSummary = ({
  calculatedFee,
  permitType,
  onPay,
}: {
  calculatedFee: number;
  permitType?: PermitType;
  onPay: () => void;
}) => {
  const [inputAction, setInputAction] = useState(false);
  const debouncedInputAction = useDebounce(inputAction, DEBOUNCE_TIMEOUT);

  useEffect(() => {
    if (debouncedInputAction) { onPay(); }

  }, [debouncedInputAction])

  return (
    <Box className="permit-pay-fee-summary">
      <Box className="permit-pay-fee-summary__pay">
        <FeeSummary permitType={permitType} feeSummary={`${calculatedFee}`} />

        <Button
          data-testid="pay-now-btn"
          className="permit-pay-fee-summary__pay-btn"
          variant="contained"
          onClick={() => setInputAction(true)}
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
