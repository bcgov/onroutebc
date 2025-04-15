import { Box, Typography } from "@mui/material";
import { RenderIf } from "../../../common/components/reusable/RenderIf";
import { Loading } from "../../../common/pages/Loading";
import { AccountDetails } from "../components/creditAccount/AccountDetails";
import { ActivityTable } from "../components/creditAccount/ActivityTable";
import { AddUser } from "../components/creditAccount/AddUser";
import { StatusChip } from "../components/creditAccount/StatusChip";
import { UserTable } from "../components/creditAccount/UserTable";
import { useGetCreditAccountQuery } from "../hooks/creditAccount";
import {
  CREDIT_ACCOUNT_STATUS_TYPE,
  CREDIT_ACCOUNT_USER_TYPE,
  CreditAccountMetadata,
} from "../types/creditAccount";
import "./CreditAccount.scss";

export const ViewCreditAccount = ({
  companyId,
  creditAccountMetadata: { creditAccountId, userType },
}: {
  companyId: number;
  creditAccountMetadata: CreditAccountMetadata;
}) => {
  const { data: creditAccount, isPending: creditAccountPending } =
    useGetCreditAccountQuery(companyId, creditAccountId);

  const isAccountHolder = userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER;

  if (creditAccountPending) return <Loading />;

  return (
    <div className="credit-account-page">
      {creditAccount && (
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
              permissionMatrixKeys={{
                permissionMatrixFeatureKey: "MANAGE_SETTINGS",
                permissionMatrixFunctionKey:
                  "VIEW_HOLD_OR_CLOSE_HISTORY_ACCOUNT_HOLDER",
              }}
              additionalConditionToCheck={() => isAccountHolder}
            />
            <RenderIf
              component={
                <AddUser
                  companyId={companyId}
                  creditAccountId={creditAccountId}
                />
              }
              permissionMatrixKeys={{
                permissionMatrixFeatureKey: "MANAGE_SETTINGS",
                permissionMatrixFunctionKey:
                  "MANAGE_CREDIT_ACCOUNT_USERS_ACCOUNT_HOLDER",
              }}
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
              permissionMatrixKeys={{
                permissionMatrixFeatureKey: "MANAGE_SETTINGS",
                permissionMatrixFunctionKey: isAccountHolder
                  ? "VIEW_CREDIT_ACCOUNT_USERS_ACCOUNT_HOLDER"
                  : "VIEW_CREDIT_ACCOUNT_USERS_ACCOUNT_USER",
              }}
            />
            <RenderIf
              component={
                <UserTable
                  companyId={companyId}
                  creditAccountMetadata={{ creditAccountId, userType }}
                />
              }
              permissionMatrixKeys={{
                permissionMatrixFeatureKey: "MANAGE_PROFILE",
                permissionMatrixFunctionKey:
                  "VIEW_CREDIT_ACCOUNT_USERS_ACCOUNT_HOLDER",
              }}
              additionalConditionToCheck={() =>
                creditAccount?.creditAccountStatusType !==
                  CREDIT_ACCOUNT_STATUS_TYPE.CLOSED && isAccountHolder
              }
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
            permissionMatrixKeys={{
              permissionMatrixFeatureKey: "MANAGE_SETTINGS",
              permissionMatrixFunctionKey: isAccountHolder
                ? "VIEW_CREDIT_ACCOUNT_DETAILS_ACCOUNT_HOLDER"
                : "VIEW_CREDIT_ACCOUNT_DETAILS_ACCOUNT_USER",
            }}
          />
          <RenderIf
            component={
              <AccountDetails
                companyId={companyId}
                creditAccountMetadata={{ creditAccountId, userType }}
                creditAccountStatus={creditAccount?.creditAccountStatusType}
              />
            }
            permissionMatrixKeys={{
              permissionMatrixFeatureKey: "MANAGE_PROFILE",
              permissionMatrixFunctionKey:
                "VIEW_CREDIT_ACCOUNT_DETAILS_ACCOUNT_HOLDER",
            }}
            additionalConditionToCheck={() =>
              // In case of BCeID user, CV - CA is only allowed
              // to see the account details if the status is active.
              creditAccount.creditAccountStatusType ===
              CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE
            }
          />
        </Box>
      )}
    </div>
  );
};
