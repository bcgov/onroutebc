import { Box, Button } from "@mui/material";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import "./PermitPayFeeSummary.scss";
import { PermitType } from "../../../../types/PermitType";
import { FeeSummary } from "../../../../components/feeSummary/FeeSummary";
import { DEBOUNCE_TIMEOUT } from "../../../../../../common/constants/constants";

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
    if (debouncedInputAction) {
      onPay();
    }
  }, [debouncedInputAction]);

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
          Pay Now
        </Button>
      </Box>
    </Box>
  );
};
