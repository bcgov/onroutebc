import { Box, Typography } from "@mui/material";
import "./AccountDetails.scss";
import { useGetCreditAccountQuery } from "../../hooks/creditAccount";
import { CreditAccountData } from "../../types/creditAccount";

export const AccountDetails = () => {
  const { data }: { data?: CreditAccountData } = useGetCreditAccountQuery();

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  return (
    <div className="account-details">
      <Box className="account-details__table">
        <Box className="account-details__header">
          <Typography className="account-details__text account-details__text--white">
            Credit Account Details
          </Typography>
        </Box>
        <Box className="account-details__body">
          <Box className="account-details__row">
            <dt className="account-details__text">Credit Limit</dt>
            <dd className="account-details__text">
              {data?.creditLimit && `$${formatNumber(data.creditLimit)}`}
            </dd>
          </Box>
          <Box className="account-details__row">
            <dt className="account-details__text">Credit Balance</dt>
            <dd className="account-details__text">
              {data?.creditBalance && `$${formatNumber(data.creditBalance)}`}
            </dd>
          </Box>
          <Box className="account-details__row">
            <dt className="account-details__text">Available Credit</dt>
            <dd className="account-details__text">
              {data?.creditAvailable &&
                `$${formatNumber(data.creditAvailable)}`}
            </dd>
          </Box>
        </Box>
      </Box>
    </div>
  );
};
