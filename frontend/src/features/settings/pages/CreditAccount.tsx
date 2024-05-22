import "./CreditAccount.scss";
import { SelectCreditLimit } from "../components/creditAccount/SelectCreditLimit";
import { useEffect, useState, useContext } from "react";
import {
  DEFAULT_CREDIT_ACCOUNT_LIMIT,
  EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT,
  CREDIT_ACCOUNT_LIMIT_CHOOSE_FROM_OPTIONS,
  CreditAccountLimitType,
} from "../types/creditAccount";
import {
  SelectChangeEvent,
  MenuItem,
  Button,
  Box,
  Typography,
} from "@mui/material";
import {
  useCreateCreditAccountMutation,
  useGetCreditAccountQuery,
} from "../hooks/creditAccount";
import { AddUser } from "../components/creditAccount/AddUser";
import { AccountDetails } from "../components/creditAccount/AccountDetails";
import { SnackBarContext } from "../../../App";

export const CreditAccount = ({
  companyId,
  // eslint-disable-next-line
  hideTab,
}: {
  companyId: number;
  hideTab?: (hide: boolean) => void;
}) => {
  const { setSnackBar } = useContext(SnackBarContext);

  const [invalid, setInvalid] = useState<boolean>(false);

  const [selectedCreditLimit, setSelectedCreditLimit] = useState<
    CreditAccountLimitType | typeof EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT
  >(DEFAULT_CREDIT_ACCOUNT_LIMIT);

  const handleSelectedCreditLimit = (event: SelectChangeEvent) => {
    setInvalid(false);
    setSelectedCreditLimit(
      event.target.value as
        | CreditAccountLimitType
        | typeof EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT,
    );
  };

  const createCreditAccountMutation = useCreateCreditAccountMutation();

  const isActionSuccessful = (status: number) => {
    return status === 201;
  };

  const handleCreateCreditAccount = async () => {
    if (selectedCreditLimit !== EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT) {
      setInvalid(false);
      const createCreditAccountResult =
        await createCreditAccountMutation.mutateAsync({
          companyId,
          selectedCreditLimit,
        });
      if (isActionSuccessful(createCreditAccountResult.status)) {
        refetchCreditAccount();
        setSnackBar({
          showSnackbar: true,
          setShowSnackbar: () => true,
          message: "Credit Account Added",
          alertType: "success",
        });
      }
    } else {
      setInvalid(true);
    }
  };

  const {
    data: existingCreditAccount,
    // isError: getCreditAccountError,
    refetch: refetchCreditAccount,
  } = useGetCreditAccountQuery(companyId);

  // let companyHasCreditAccount: boolean

  // Re-render if credit account exists
  useEffect(() => {}, [existingCreditAccount]);

  return (
    <div className="credit-account-page">
      {existingCreditAccount ? (
        <Box className="credit-account-page__split-container">
          <Box className="account-info">
            <Box className="overview">
              <Typography variant="h3" className="overview__title">
                Credit Account No: {existingCreditAccount.accountNumber}
              </Typography>
              <Typography className="overview__user-designation">
                {existingCreditAccount.userDesignation}
              </Typography>
            </Box>

            <AddUser />
          </Box>
          <AccountDetails companyId={companyId} />
        </Box>
      ) : (
        <Box>
          <Typography variant="h3" className="credit-account-page__title">
            Add Credit Account
          </Typography>
          <Box className="add-credit-account-action">
            <Box>
              <SelectCreditLimit
                value={selectedCreditLimit}
                label={"Credit Limit"}
                onChange={handleSelectedCreditLimit}
                menuItems={CREDIT_ACCOUNT_LIMIT_CHOOSE_FROM_OPTIONS.map(
                  (data) => (
                    <MenuItem key={data.value} value={data.value}>
                      {data.label}
                    </MenuItem>
                  ),
                )}
                invalid={invalid}
              />
            </Box>
            <Button
              className={`add-credit-account-action__btn ${invalid && "add-credit-account-action__btn--error"}`}
              variant="contained"
              onClick={handleCreateCreditAccount}
            >
              Add Credit Account
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};
