/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { RenderIf } from "../../../common/components/reusable/RenderIf";
import { Loading } from "../../../common/pages/Loading";
import { AccountDetails } from "../components/creditAccount/AccountDetails";
import { ActivityTable } from "../components/creditAccount/ActivityTable";
import { AddUser } from "../components/creditAccount/AddUser";
import { SelectCreditLimit } from "../components/creditAccount/SelectCreditLimit";
import { StatusChip } from "../components/creditAccount/StatusChip";
import { UserTable } from "../components/creditAccount/UserTable";
import {
  useCreateCreditAccountMutation,
  useGetCreditAccountQuery,
} from "../hooks/creditAccount";
import {
  CREDIT_ACCOUNT_LIMIT_CHOOSE_FROM_OPTIONS,
  CREDIT_ACCOUNT_STATUS_TYPE,
  CREDIT_ACCOUNT_USER_TYPE,
  CreditAccountLimitType,
  CreditAccountMetadata,
  DEFAULT_CREDIT_ACCOUNT_LIMIT,
  EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT,
} from "../types/creditAccount";
import "./CreditAccount.scss";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { BCeID_USER_AUTH_GROUP } from "../../../common/authentication/types";

export const CreditAccount = ({
  companyId,
  creditAccountMetadata: { creditAccountId, userType },
}: {
  companyId: number;
  creditAccountMetadata: CreditAccountMetadata;
}) => {
  const [invalid, setInvalid] = useState<boolean>(false);
  const { userDetails } = useContext(OnRouteBCContext);

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

  const {
    data: creditAccount,
    isPending: creditAccountPending,
    refetch: refetchCreditAccount,
  } = useGetCreditAccountQuery(companyId, creditAccountId);

  const { mutateAsync, isPending: creditAccountCreationPending } =
    useCreateCreditAccountMutation();

  const isAccountHolder = userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER;

  const isActionSuccessful = (status: number) => {
    return status === 201;
  };

  const handleCreateCreditAccount = async () => {
    if (selectedCreditLimit !== EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT) {
      setInvalid(false);
      const { status } = await mutateAsync({
        companyId,
        creditLimit: selectedCreditLimit,
      });
      if (isActionSuccessful(status)) {
        refetchCreditAccount();
      } else {
        console.error(`${status}: Failed to create credit account.`);
      }
    } else {
      setInvalid(true);
    }
  };

  if (creditAccountPending) return <Loading />;

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
            <RenderIf
              component={
                <ActivityTable
                  companyId={companyId}
                  creditAccountId={creditAccountId}
                />
              }
              permissionMatrixFeatureKey="MANAGE_SETTINGS"
              permissionMatrixFunctionKey="UPDATE_CREDIT_ACCOUNT_DETAILS"
              additionalConditionToCheck={() => isAccountHolder}
            />
            <RenderIf
              component={
                <AddUser
                  companyId={companyId}
                  creditAccountId={creditAccountId}
                />
              }
              permissionMatrixFeatureKey="MANAGE_SETTINGS"
              permissionMatrixFunctionKey="UPDATE_CREDIT_ACCOUNT_DETAILS"
              additionalConditionToCheck={() =>
                creditAccount?.creditAccountStatusType !==
                  CREDIT_ACCOUNT_STATUS_TYPE.CLOSED && isAccountHolder
              }
            />
            <RenderIf
              component={
                <UserTable
                  companyId={companyId}
                  creditAccountMetadata={{ creditAccountId, userType }}
                />
              }
              permissionMatrixFeatureKey="MANAGE_SETTINGS"
              permissionMatrixFunctionKey="VIEW_CREDIT_ACCOUNT_DETAILS"
            />
          </Box>
          <RenderIf
            component={
              <AccountDetails
                companyId={companyId}
                creditAccountMetadata={{ creditAccountId, userType }}
                creditAccountStatus={creditAccount?.creditAccountStatusType}
              />
            }
            permissionMatrixFeatureKey="MANAGE_SETTINGS"
            permissionMatrixFunctionKey="VIEW_CREDIT_ACCOUNT_DETAILS"
            additionalConditionToCheck={() => {
              // In case of BCeID user, CV - CA is only allowed
              // to see the account details if the status is active.
              if (userDetails && userDetails.userAuthGroup) {
                return (
                  creditAccount.creditAccountStatusType ===
                  CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE
                );
              } else {
                return true;
              }
            }}
          />
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
