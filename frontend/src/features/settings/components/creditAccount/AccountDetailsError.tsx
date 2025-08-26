/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from "@mui/material";
import {
  EGARMS_CODE_ERROR_MESSAGES,
  EGARMS_ERROR_CODE_TYPE,
} from "../../types/creditAccount";
import "./AccountDetailsError.scss";
import { ErrorAltBcGovBanner } from "../../../../common/components/banners/ErrorAltBcGovBanner";

/**
 * Component that displays eGARMS error status if credit limit cannot be displayed.
 */
export const AccountDetailsError = ({
  eGARMSReturnCode,
}: {
  eGARMSReturnCode?: EGARMS_ERROR_CODE_TYPE;
}) => {
  let headerErrorMessage;
  let errorMessage;
  if (eGARMSReturnCode && eGARMSReturnCode in EGARMS_CODE_ERROR_MESSAGES) {
    headerErrorMessage = `eGARMS return code ${eGARMSReturnCode}`;
    errorMessage = EGARMS_CODE_ERROR_MESSAGES[eGARMSReturnCode];
  } else {
    headerErrorMessage = "eGARMS error";
    errorMessage = EGARMS_CODE_ERROR_MESSAGES["DEFAULT"];
  }

  return (
    <Box className="account-details-error__container">
      <div className="account-details-error__banner">
        <ErrorAltBcGovBanner msg={headerErrorMessage} />
      </div>
      <div className="account-details-error__info">
        <span>{errorMessage}</span>
      </div>
    </Box>
  );
};
