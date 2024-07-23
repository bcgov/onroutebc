/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Typography,
  Button,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  useGetCreditAccountQuery,
  useUpdateCreditAccountStatusMutation,
} from "../../hooks/creditAccount";
import {
  CREDIT_ACCOUNT_STATUS_TYPE,
  CREDIT_ACCOUNT_USER_TYPE,
  UPDATE_STATUS_ACTIONS,
  UpdateStatusData,
} from "../../types/creditAccount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, MouseEvent } from "react";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { canUpdateCreditAccount } from "../../helpers/permissions";
import { HoldCreditAccountModal } from "./HoldCreditAccountModal";
import { CloseCreditAccountModal } from "./CloseCreditAccountModal";
import "./AccountDetails.scss";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { RenderIf } from "../../../../common/components/reusable/RenderIf";
import { MANAGE_SETTINGS } from "../../../../common/authentication/PermissionMatrix";

export const AccountDetails = () => {
  const { userRoles, companyId } = useContext(OnRouteBCContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showHoldCreditAccountModal, setShowHoldCreditAccountModal] =
    useState<boolean>(false);
  const [showCloseCreditAccountModal, setShowCloseCreditAccountModal] =
    useState<boolean>(false);
  const isMenuOpen = Boolean(anchorEl);

  const { data: creditAccount, refetch: refetchCreditAccount } =
    useGetCreditAccountQuery(getDefaultRequiredVal(0, companyId));

  const { mutateAsync, isPending } = useUpdateCreditAccountStatusMutation();

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

  const accountHolder = creditAccount?.creditAccountUsers.find(
    (user) => user.userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER,
  );

  const isAccountHolder = companyId === accountHolder?.companyId;

  const handleMenuOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActionSuccessful = (status: number) => {
    return status === 200;
  };

  const handleUpdateCreditAccountStatus = async (
    updateStatusData: UpdateStatusData,
  ) => {
    if (creditAccount?.creditAccountId) {
      const { status } = await mutateAsync({
        companyId: getDefaultRequiredVal(0, companyId),
        creditAccountId: creditAccount?.creditAccountId,
        updateStatusData,
      });

      if (isActionSuccessful(status)) {
        setShowHoldCreditAccountModal(false);
        setShowCloseCreditAccountModal(false);
        handleMenuClose();
        refetchCreditAccount();
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
                  {creditAccount?.creditAccountStatusType ===
                    CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE && (
                    <MenuItem
                      onClick={() => setShowHoldCreditAccountModal(true)}
                      disabled={isPending}
                    >
                      Put On Hold
                    </MenuItem>
                  )}
                  {creditAccount?.creditAccountStatusType ===
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
                  {(creditAccount?.creditAccountStatusType ===
                    CREDIT_ACCOUNT_STATUS_TYPE.ACTIVE ||
                    creditAccount?.creditAccountStatusType ===
                      CREDIT_ACCOUNT_STATUS_TYPE.ONHOLD) && (
                    <MenuItem
                      onClick={() => setShowCloseCreditAccountModal(true)}
                    >
                      Close Credit Account
                    </MenuItem>
                  )}
                  {creditAccount?.creditAccountStatusType ===
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
            {...MANAGE_SETTINGS.UPDATE_CREDIT_ACCOUNT_DETAILS}
            customFunction={() => isAccountHolder}
          />
        </Box>
        {/* TODO remove mock values once API is complete */}
        <Box className="account-details__body">
          <Box className="account-details__row">
            <dt className="account-details__text">Credit Limit</dt>
            <dd className="account-details__text">
              {renderValue(100000)}
              {/* {creditAccount?.creditLimit &&
                renderValue(creditAccount.creditLimit)} */}
            </dd>
          </Box>
          <Box className="account-details__row">
            <dt className="account-details__text">Credit Balance</dt>
            <dd className="account-details__text">
              {renderValue(0)}
              {/* {creditAccount?.creditBalance &&
                renderValue(creditAccount.creditBalance)} */}
            </dd>
          </Box>
          <Box className="account-details__row">
            <dt className="account-details__text">Available Credit</dt>
            <dd className="account-details__text">
              {renderValue(100000)}
              {/* {creditAccount?.availableCredit &&
                renderValue(creditAccount.availableCredit)} */}
            </dd>
          </Box>
        </Box>
      </Box>
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
