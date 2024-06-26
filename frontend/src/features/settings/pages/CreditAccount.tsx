import "./CreditAccount.scss";
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
  useCreditAccountHistoryQuery,
} from "../hooks/creditAccount";
import { AddUser } from "../components/creditAccount/AddUser";
import { AccountDetails } from "../components/creditAccount/AccountDetails";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { UserTable } from "../components/creditAccount/UserTable";
import { canUpdateCreditAccount } from "../helpers/permissions";
import { HistoryTable } from "../components/creditAccount/HistoryTable";
import { StatusChip } from "../components/creditAccount/StatusChip";

export const CreditAccount = ({
  companyId,
  // eslint-disable-next-line
  hideTab,
}: {
  companyId: number;
  hideTab?: (hide: boolean) => void;
}) => {
  const { userRoles } = useContext(OnRouteBCContext);

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

  const { data: creditAccount } = useGetCreditAccountQuery();

  const { data: creditAccountHistory } = useCreditAccountHistoryQuery();

  const createCreditAccountMutation = useCreateCreditAccountMutation();

  const { isPending: creditAccountCreationPending } =
    createCreditAccountMutation;

  const handleCreateCreditAccount = async () => {
    if (selectedCreditLimit !== EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT) {
      setInvalid(false);
      await createCreditAccountMutation.mutateAsync(selectedCreditLimit);
    } else {
      setInvalid(true);
    }
  };

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
                {creditAccount.creditAccountStatusType !== "ACTIVE" && (
                  <StatusChip status={creditAccount.creditAccountStatusType} />
                )}
              </Box>
              <Typography className="overview__user-designation">
                {creditAccount.companyId === companyId
                  ? "Account Holder"
                  : "Account User"}
              </Typography>
            </Box>
            {creditAccountHistory && <HistoryTable />}
            {canUpdateCreditAccount(userRoles) && <AddUser />}
            <UserTable />
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
