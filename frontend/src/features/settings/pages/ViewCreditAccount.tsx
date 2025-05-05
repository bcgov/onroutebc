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
import { InfoBcGovBanner } from "../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";
import {
  CVSE_REVENUE_EMAIL,
  CVSE_REVENUE_PHONE,
} from "../../../common/constants/constants";
import { useContext } from "react";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";

export const ViewCreditAccount = ({
  companyId,
  creditAccountMetadata,
  fromTab,
}: {
  companyId: number;
  creditAccountMetadata: CreditAccountMetadata;
  /**
   * The tab from where this component is called.
   */
  fromTab: "MANAGE_SETTINGS" | "MANAGE_PROFILE";
}) => {
  const { creditAccountId, userType } = creditAccountMetadata;
  const { data: creditAccount, isPending: creditAccountPending } =
    useGetCreditAccountQuery(companyId, creditAccountId);

  const { idirUserDetails } = useContext(OnRouteBCContext);
  const isIdir = Boolean(idirUserDetails?.userRole);

  const isAccountHolder = userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER;

  const isStaffOrVerifiedAccount =
    isIdir || (!isIdir && creditAccount?.isVerified);

  if (creditAccountPending) return <Loading />;
  return (
    <div className="credit-account-page">
      {creditAccount && (
        <Box className="credit-account-page__split-container">
          <Box className="account-info">
            <Box className="overview">
              <Box className="overview__flex">
                <Typography variant="h3" className="overview__title">
                  Credit Account No:{" "}
                  {isStaffOrVerifiedAccount &&
                    creditAccount.creditAccountNumber}
                </Typography>
                {!creditAccount?.isVerified && (
                  <StatusChip status="UNVERIFIED" />
                )}
                {isStaffOrVerifiedAccount && (
                  <StatusChip status={creditAccount.creditAccountStatusType} />
                )}
              </Box>
              <Typography className="overview__user-designation">
                {isAccountHolder ? "Account Holder" : "Account User"}
              </Typography>
              <RenderIf
                component={
                  <Box className="overview__info-banner">
                    <InfoBcGovBanner
                      msg={
                        <div className="overview__info-banner__banner">
                          {BANNER_MESSAGES.CREDIT_ACCOUNT_CVSE_INFO}
                          Phone:
                          <span className="overview__info-banner__contact">
                            {CVSE_REVENUE_PHONE}{" "}
                          </span>
                          Email:
                          <span className="overview__info-banner__contact">
                            {CVSE_REVENUE_EMAIL}
                          </span>
                        </div>
                      }
                    />
                  </Box>
                }
                permissionMatrixKeys={{
                  permissionMatrixFeatureKey: "MANAGE_PROFILE",
                  permissionMatrixFunctionKey:
                    "VIEW_CREDIT_ACCOUNT_INFO_BANNER_ACCOUNT_HOLDER",
                }}
                additionalConditionToCheck={() => isAccountHolder}
              />
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
                  creditAccountMetadata={{
                    creditAccountId,
                    userType,
                    isValidPaymentMethod:
                      creditAccountMetadata.isValidPaymentMethod,
                  }}
                />
              }
              permissionMatrixKeys={
                fromTab === "MANAGE_SETTINGS"
                  ? {
                      permissionMatrixFeatureKey: "MANAGE_SETTINGS",
                      permissionMatrixFunctionKey: isAccountHolder
                        ? "VIEW_CREDIT_ACCOUNT_USERS_ACCOUNT_HOLDER"
                        : "VIEW_CREDIT_ACCOUNT_USERS_ACCOUNT_USER",
                    }
                  : {
                      permissionMatrixFeatureKey: "MANAGE_PROFILE",
                      permissionMatrixFunctionKey:
                        "VIEW_CREDIT_ACCOUNT_USERS_ACCOUNT_HOLDER",
                    }
              }
              additionalConditionToCheck={() =>
                fromTab === "MANAGE_SETTINGS" ||
                (fromTab === "MANAGE_PROFILE" &&
                  isAccountHolder &&
                  creditAccount?.isVerified)
              }
            />
          </Box>
          <RenderIf
            component={
              <AccountDetails
                companyId={companyId}
                creditAccountMetadata={creditAccountMetadata}
                creditAccountStatus={creditAccount?.creditAccountStatusType}
                isCreditAccountVerified={creditAccount?.isVerified}
              />
            }
            permissionMatrixKeys={
              fromTab === "MANAGE_SETTINGS"
                ? {
                    permissionMatrixFeatureKey: "MANAGE_SETTINGS",
                    permissionMatrixFunctionKey: isAccountHolder
                      ? "VIEW_CREDIT_ACCOUNT_DETAILS_ACCOUNT_HOLDER"
                      : "VIEW_CREDIT_ACCOUNT_DETAILS_ACCOUNT_USER",
                  }
                : {
                    permissionMatrixFeatureKey: "MANAGE_PROFILE",
                    permissionMatrixFunctionKey:
                      "VIEW_CREDIT_ACCOUNT_DETAILS_ACCOUNT_HOLDER",
                  }
            }
            additionalConditionToCheck={() =>
              // In case of BCeID user, CV - CA is only allowed
              // to see the account details if the status is active.
              fromTab === "MANAGE_SETTINGS" ||
              (fromTab === "MANAGE_PROFILE" &&
                creditAccount.creditAccountStatusType ===
                  CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE &&
                creditAccount?.isVerified)
            }
          />
        </Box>
      )}
    </div>
  );
};
