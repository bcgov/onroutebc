import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { RenderIf } from "../../../../common/components/reusable/RenderIf";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import {
  useGetCreditAccountLimitsQuery,
  useUpdateCreditAccountStatusMutation,
  useVerifyCreditAccountMutation,
} from "../../hooks/creditAccount";
import {
  CREDIT_ACCOUNT_STATUS_TYPE,
  CREDIT_ACCOUNT_USER_TYPE,
  CreditAccountMetadata,
  CreditAccountStatusType,
  UPDATE_STATUS_ACTIONS,
  UpdateStatusData,
} from "../../types/creditAccount";
import "./AccountDetails.scss";
import { CloseCreditAccountModal } from "./CloseCreditAccountModal";
import { HoldCreditAccountModal } from "./HoldCreditAccountModal";
import { useQueryClient } from "@tanstack/react-query";
import { VerifyCreditAccountModal } from "./VerifyCreditAccountModal";

/**
 * Component that displays credit limit, available balance etc.
 */
export const AccountDetails = ({
  companyId,
  creditAccountMetadata: { creditAccountId, userType },
  creditAccountStatus,
  isCreditAccountVerified,
}: {
  companyId: number;
  creditAccountMetadata: CreditAccountMetadata;
  creditAccountStatus: CreditAccountStatusType;
  isCreditAccountVerified: boolean;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showVerifyCreditAccountModal, setShowVerifyCreditAccountModal] =
    useState<boolean>(false);
  const [showHoldCreditAccountModal, setShowHoldCreditAccountModal] =
    useState<boolean>(false);
  const [showCloseCreditAccountModal, setShowCloseCreditAccountModal] =
    useState<boolean>(false);
  const isMenuOpen = Boolean(anchorEl);
  const queryClient = useQueryClient();

  const { data: creditAccountLimitData } = useGetCreditAccountLimitsQuery({
    companyId,
    creditAccountId,
  });

  const { mutateAsync, isPending } = useUpdateCreditAccountStatusMutation();

  const {
    mutateAsync: mutateAsyncVerifyCreditAccount,
    isPending: isPendingVerifyCreditAccount,
  } = useVerifyCreditAccountMutation();

  const toSentenceCase = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatValue = (value: number | string): string => {
    if (typeof value === "number" || !isNaN(Number(value))) {
      return new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value));
    } else {
      return toSentenceCase(value);
    }
  };

  const renderValue = (value: number | string): string => {
    if (typeof value === "number" || !isNaN(Number(value))) {
      return `$${formatValue(value)}`;
    } else {
      return formatValue(value);
    }
  };

  const isAccountHolder = userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER;

  const handleMenuOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActionSuccessful = (status: number) => {
    return status === 200;
  };

  const handleVerifyCreditAccount = async (reason: string) => {
    if (creditAccountId) {
      const { status } = await mutateAsyncVerifyCreditAccount({
        companyId: getDefaultRequiredVal(0, companyId),
        creditAccountId,
        reason,
      });

      if (isActionSuccessful(status)) {
        setShowVerifyCreditAccountModal(false);
        handleMenuClose();
        // Reload all credit account data.
        queryClient.refetchQueries({
          predicate: (query) => query.queryKey[0] === "credit-account",
        });
      } else {
        console.error(`${status}: Failed to update credit account status.`);
      }
    }
  };

  const handleUpdateCreditAccountStatus = async (
    updateStatusData: UpdateStatusData,
  ) => {
    if (creditAccountId) {
      const { status } = await mutateAsync({
        companyId: getDefaultRequiredVal(0, companyId),
        creditAccountId,
        updateStatusData,
      });

      if (isActionSuccessful(status)) {
        setShowHoldCreditAccountModal(false);
        setShowCloseCreditAccountModal(false);
        handleMenuClose();
        // Reload all credit account data.
        queryClient.refetchQueries({
          predicate: (query) => query.queryKey[0] === "credit-account",
        });
      } else {
        console.error(`${status}: Failed to update credit account status.`);
      }
    }
  };

  return (
    <div className="account-details">
      <Box className="account-details__table">
        <Box className="account-details__header">
          <Typography className="account-details__text account-details__text--white">
            Credit Account Details
          </Typography>

          <RenderIf
            component={
              <Box>
                <Tooltip title="Actions">
                  <Button
                    className="account-details__button"
                    id="actions-button"
                    aria-label="Expand credit account details actions menu"
                    aria-controls={isMenuOpen ? "actions menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? "true" : undefined}
                    onClick={handleMenuOpen}
                  >
                    <FontAwesomeIcon
                      icon={faEllipsisV}
                      className="button__icon"
                    />
                  </Button>
                </Tooltip>
                <Menu
                  className="account-details__menu"
                  id="actions-menu"
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    "aria-labelledby": "actions-button",
                  }}
                >
                  {!isCreditAccountVerified && (
                    <MenuItem
                      onClick={() => setShowVerifyCreditAccountModal(true)}
                      disabled={isPendingVerifyCreditAccount}
                    >
                      Verify Account
                    </MenuItem>
                  )}
                  {creditAccountStatus ===
                    CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE && (
                    <MenuItem
                      onClick={() => setShowHoldCreditAccountModal(true)}
                      disabled={isPending}
                    >
                      Put On Hold
                    </MenuItem>
                  )}
                  {creditAccountStatus ===
                    CREDIT_ACCOUNT_STATUS_TYPE.ONHOLD && (
                    <MenuItem
                      onClick={() =>
                        handleUpdateCreditAccountStatus({
                          updateStatusAction:
                            UPDATE_STATUS_ACTIONS.UNHOLD_CREDIT_ACCOUNT,
                        })
                      }
                      disabled={isPending}
                    >
                      Remove Hold
                    </MenuItem>
                  )}
                  {creditAccountStatus !==
                    CREDIT_ACCOUNT_STATUS_TYPE.CLOSED && (
                    <MenuItem
                      onClick={() => setShowCloseCreditAccountModal(true)}
                    >
                      Close Credit Account
                    </MenuItem>
                  )}
                  {creditAccountStatus ===
                    CREDIT_ACCOUNT_STATUS_TYPE.CLOSED && (
                    <MenuItem
                      onClick={() =>
                        handleUpdateCreditAccountStatus({
                          updateStatusAction:
                            UPDATE_STATUS_ACTIONS.REOPEN_CREDIT_ACCOUNT,
                        })
                      }
                      disabled={isPending}
                    >
                      Reopen Credit Account
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            }
            permissionMatrixKeys={{
              permissionMatrixFeatureKey: "MANAGE_SETTINGS",
              permissionMatrixFunctionKey:
                "PERFORM_CREDIT_ACCOUNT_DETAIL_ACTIONS_ACCOUNT_HOLDER",
            }}
            additionalConditionToCheck={() => isAccountHolder}
          />
        </Box>
        <Box className="account-details__body">
          {creditAccountLimitData?.creditLimit !== undefined && (
            <Box className="account-details__row">
              <dt className="account-details__text">Credit Limit</dt>
              <dd className="account-details__text">
                {renderValue(creditAccountLimitData.creditLimit)}
              </dd>
            </Box>
          )}
          {creditAccountLimitData?.creditBalance !== undefined && (
            <Box className="account-details__row">
              <dt className="account-details__text">Credit Balance</dt>
              <dd className="account-details__text">
                {renderValue(creditAccountLimitData.creditBalance)}
              </dd>
            </Box>
          )}
          {creditAccountLimitData?.availableCredit !== undefined && (
            <Box className="account-details__row">
              <dt className="account-details__text">Available Credit</dt>
              <dd className="account-details__text">
                {renderValue(creditAccountLimitData.availableCredit)}
              </dd>
            </Box>
          )}
        </Box>
      </Box>
      {showVerifyCreditAccountModal && (
        <VerifyCreditAccountModal
          showModal={showVerifyCreditAccountModal}
          onCancel={() => setShowVerifyCreditAccountModal(false)}
          onConfirm={handleVerifyCreditAccount}
          isPending={isPendingVerifyCreditAccount}
        />
      )}
      {showHoldCreditAccountModal && (
        <HoldCreditAccountModal
          showModal={showHoldCreditAccountModal}
          onCancel={() => setShowHoldCreditAccountModal(false)}
          onConfirm={handleUpdateCreditAccountStatus}
          isPending={isPending}
        />
      )}
      {showCloseCreditAccountModal && (
        <CloseCreditAccountModal
          showModal={showCloseCreditAccountModal}
          onCancel={() => setShowCloseCreditAccountModal(false)}
          onConfirm={handleUpdateCreditAccountStatus}
          isPending={isPending}
        />
      )}
    </div>
  );
};
