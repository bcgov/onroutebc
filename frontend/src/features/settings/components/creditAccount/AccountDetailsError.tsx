/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/material";
import {
  EGARMS_CODE_ERROR_MESSAGES,
  EGARMS_ERROR_CODE_TYPE,
} from "../../types/creditAccount";
import "./AccountDetails.scss";
import { BcGovAlertBanner } from "../../../../common/components/banners/BcGovAlertBanner";
import { ErrorAltBcGovBanner } from "../../../../common/components/banners/ErrorAltBcGovBanner";

/**
 * Component that displays eGARMS error status if credit limit cannot be displayed.
 */
export const AccountDetailsError = ({
  eGARMSReturnCode,
}: {
  eGARMSReturnCode?: EGARMS_ERROR_CODE_TYPE;
}) => {
  let errorMessage;
  if (eGARMSReturnCode && eGARMSReturnCode in EGARMS_CODE_ERROR_MESSAGES) {
    errorMessage = EGARMS_CODE_ERROR_MESSAGES[eGARMSReturnCode];
  } else {
    errorMessage = EGARMS_CODE_ERROR_MESSAGES["DEFAULT"];
  }

  return (
    <Box>
      <ErrorAltBcGovBanner msg={errorMessage} />
      {/* eGARMS error {errorMessage} */}
    </Box>
  );
};
