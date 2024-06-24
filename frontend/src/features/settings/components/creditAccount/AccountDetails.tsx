import {
  Box,
  Typography,
  Button,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import "./AccountDetails.scss";
import {
  useGetCreditAccountQuery,
  useHoldCreditAccountMutation,
  useCloseCreditAccountMutation,
} from "../../hooks/creditAccount";
import {
  CreditAccountData,
  HOLD_ACTIVITY_TYPES,
  CLOSE_ACTIVITY_TYPES,
} from "../../types/creditAccount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, MouseEvent } from "react";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { canUpdateCreditAccount } from "../../helpers/permissions";
import { SnackBarContext } from "../../../../App";
import { HoldCreditAccountModal } from "./HoldCreditAccountModal";
import { CloseCreditAccountModal } from "./CloseCreditAccountModal";

export const AccountDetails = () => {
  const { userRoles } = useContext(OnRouteBCContext);
  const { setSnackBar } = useContext(SnackBarContext);
  // const { data }: { data?: CreditAccountData } = useGetCreditAccountQuery();
  const { data: creditAccountData }: { data?: CreditAccountData } =
    useGetCreditAccountQuery();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHoldDialogOpen, setIsHoldDialogOpen] = useState<boolean>(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);

  const isMenuOpen = Boolean(anchorEl);

  const holdCreditAccountMutation = useHoldCreditAccountMutation();
  const closeCreditAccountMutation = useCloseCreditAccountMutation();

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleMenuOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActionSuccessful = (status: number) => {
    return status === 200;
  };

  const handleHoldCreditAccount = async (reason: string) => {
    const holdResult = await holdCreditAccountMutation.mutateAsync({
      holdActivityType: HOLD_ACTIVITY_TYPES.HOLD_CREDIT_ACCOUNT,
      reason,
    });

    if (isActionSuccessful(holdResult.status)) {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "info",
        message: "Credit Account On Hold",
      });
      handleMenuClose();
    }
    // refetchCreditAccountHistory();
    setIsHoldDialogOpen(false);
  };

  const handleUnholdCreditAccount = async () => {
    const unholdResult = await holdCreditAccountMutation.mutateAsync({
      holdActivityType: HOLD_ACTIVITY_TYPES.UNHOLD_CREDIT_ACCOUNT,
    });

    if (isActionSuccessful(unholdResult.status)) {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "success",
        message: "Hold Removed",
      });
      handleMenuClose();
    }
  };

  const handleCloseCreditAccount = async (reason: string) => {
    const closeResult = await closeCreditAccountMutation.mutateAsync({
      closeActivityType: CLOSE_ACTIVITY_TYPES.CLOSE_CREDIT_ACCOUNT,
      reason,
    });

    if (isActionSuccessful(closeResult.status)) {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "info",
        message: "Credit Account Closed",
      });
      handleMenuClose();
    }
    // refetchCreditAccountHistory();
    setIsCloseDialogOpen(false);
  };

  const handleReopenCreditAccount = async () => {
    const reopenResult = await closeCreditAccountMutation.mutateAsync({
      closeActivityType: CLOSE_ACTIVITY_TYPES.REOPEN_CREDIT_ACCOUNT,
    });

    if (isActionSuccessful(reopenResult.status)) {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "success",
        message: "Credit Account Reopened",
      });
      handleMenuClose();
    }
  };

  return (
    <div className="account-details">
      <Box className="account-details__table">
        <Box className="account-details__header">
          <Typography className="account-details__text account-details__text--white">
            Credit Account Details
          </Typography>
          {canUpdateCreditAccount(userRoles) && (
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
                {creditAccountData?.creditAccountStatusType === "ACTIVE" && (
                  <MenuItem
                    onClick={() => setIsHoldDialogOpen(true)}
                    disabled={holdCreditAccountMutation.isPending}
                  >
                    Put On Hold
                  </MenuItem>
                )}
                {creditAccountData?.creditAccountStatusType === "ON HOLD" && (
                  <MenuItem
                    onClick={handleUnholdCreditAccount}
                    disabled={holdCreditAccountMutation.isPending}
                  >
                    Remove Hold
                  </MenuItem>
                )}
                {(creditAccountData?.creditAccountStatusType === "ACTIVE" ||
                  creditAccountData?.creditAccountStatusType === "ON HOLD") && (
                  <MenuItem onClick={() => setIsCloseDialogOpen(true)}>
                    Close Credit Account
                  </MenuItem>
                )}
                {creditAccountData?.creditAccountStatusType === "CLOSED" && (
                  <MenuItem
                    onClick={handleReopenCreditAccount}
                    disabled={closeCreditAccountMutation.isPending}
                  >
                    Reopen Credit Account
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </Box>
        <Box className="account-details__body">
          <Box className="account-details__row">
            <dt className="account-details__text">Credit Limit</dt>
            <dd className="account-details__text">
              {creditAccountData?.creditLimit &&
                `$${formatNumber(Number(creditAccountData.creditLimit))}`}
            </dd>
          </Box>
          <Box className="account-details__row">
            <dt className="account-details__text">Credit Balance</dt>
            <dd className="account-details__text">
              {creditAccountData?.creditBalance !== undefined &&
                `$${formatNumber(creditAccountData.creditBalance)}`}
            </dd>
          </Box>
          <Box className="account-details__row">
            <dt className="account-details__text">Available Credit</dt>
            <dd className="account-details__text">
              {creditAccountData?.availableCredit &&
                `$${formatNumber(Number(creditAccountData.availableCredit))}`}
            </dd>
          </Box>
        </Box>
      </Box>
      {isHoldDialogOpen && (
        <HoldCreditAccountModal
          showModal={isHoldDialogOpen}
          onCancel={() => setIsHoldDialogOpen(false)}
          onConfirm={handleHoldCreditAccount}
        />
      )}
      {isCloseDialogOpen && (
        <CloseCreditAccountModal
          showModal={isCloseDialogOpen}
          onCancel={() => setIsCloseDialogOpen(false)}
          onConfirm={handleCloseCreditAccount}
        />
      )}
    </div>
  );
};
