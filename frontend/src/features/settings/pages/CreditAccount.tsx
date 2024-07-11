import { SelectCreditLimit } from "../components/creditAccount/SelectCreditLimit";
import { useState, useContext } from "react";
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
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { UserTable } from "../components/creditAccount/UserTable";
import {
  canUpdateCreditAccount,
  canViewCreditAccountDetails,
} from "../helpers/permissions";
import { ActivityTable } from "../components/creditAccount/ActivityTable";
import { StatusChip } from "../components/creditAccount/StatusChip";
import "./CreditAccount.scss";

export const CreditAccount = ({ companyId }: { companyId: number }) => {
  const { userRoles, userDetails, idirUserDetails } =
    useContext(OnRouteBCContext);

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

  const { data: creditAccount, refetch: refetchCreditAccount } =
    useGetCreditAccountQuery();

  const createCreditAccountMutation = useCreateCreditAccountMutation();

  const { isPending: creditAccountCreationPending } =
    createCreditAccountMutation;

  const isAccountHolder =
    creditAccount?.creditAccountUsers[0].companyId === companyId;

  const isActionSuccessful = (status: number) => {
    return status === 201;
  };

  const handleCreateCreditAccount = async () => {
    if (selectedCreditLimit !== EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT) {
      setInvalid(false);
      const { status } =
        await createCreditAccountMutation.mutateAsync(selectedCreditLimit);
      if (isActionSuccessful(status)) {
        refetchCreditAccount();
      }
    } else {
      setInvalid(true);
    }
  };

  const showCreditAccountDetails =
    canViewCreditAccountDetails(
      userDetails?.userAuthGroup || idirUserDetails?.userAuthGroup,
    ) && isAccountHolder;

  return (
    <div className="credit-account-page">
      {creditAccount ? (
        <Box className="credit-account-page__split-container">
          <Box className="account-info">
            <Box className="overview">
              <Box className="overview__flex">
                <Typography variant="h3" className="overview__title">
                  Credit Account No: {creditAccount.creditAccountNumber}
                </Typography>

                <StatusChip status={creditAccount.creditAccountStatusType} />
              </Box>
              <Typography className="overview__user-designation">
                {isAccountHolder ? "Account Holder" : "Account User"}
              </Typography>
            </Box>
            <ActivityTable />
            {canUpdateCreditAccount(userRoles) &&
              creditAccount.creditAccountStatusType !== "CLOSED" && <AddUser />}
            {showCreditAccountDetails && <UserTable />}
          </Box>
          <AccountDetails />
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
              disabled={creditAccountCreationPending}
            >
              Add Credit Account
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};
