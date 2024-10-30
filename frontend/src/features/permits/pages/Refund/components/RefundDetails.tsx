/* eslint-disable @typescript-eslint/no-unused-vars */
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
import "./RefundDetails.scss";

import { useQueryClient } from "@tanstack/react-query";
import {
  CREDIT_ACCOUNT_STATUS_TYPE,
  CREDIT_ACCOUNT_USER_TYPE,
  CreditAccountMetadata,
  CreditAccountStatusType,
  UPDATE_STATUS_ACTIONS,
  UpdateStatusData,
} from "../../../../settings/types/creditAccount";
import { useUpdateCreditAccountStatusMutation } from "../../../../settings/hooks/creditAccount";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { RenderIf } from "../../../../../common/components/reusable/RenderIf";
import { HoldCreditAccountModal } from "../../../../settings/components/creditAccount/HoldCreditAccountModal";
import { CloseCreditAccountModal } from "../../../../settings/components/creditAccount/CloseCreditAccountModal";

/**
 * Component that displays credit limit, available balance etc.
 */
export const RefundDetails = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showHoldCreditAccountModal, setShowHoldCreditAccountModal] =
    useState<boolean>(false);
  const [showCloseCreditAccountModal, setShowCloseCreditAccountModal] =
    useState<boolean>(false);
  const isMenuOpen = Boolean(anchorEl);
  const queryClient = useQueryClient();

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

  const handleMenuOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActionSuccessful = (status: number) => {
    return status === 200;
  };

  return (
    <div className="refund-details">
      <Box className="refund-details__table">
        <Box className="refund-details__col">
          <dt className="refund-details__text">Total Refund Due</dt>
          <dd className="refund-details__text">{renderValue(60)}</dd>
        </Box>
        <Box className="refund-details__col">
          <dt className="refund-details__text">Current Permit Value</dt>
          <dd className="refund-details__text">{renderValue(60)}</dd>
        </Box>
        <Box className="refund-details__col">
          <dt className="refund-details__text">New Permit Value</dt>
          <dd className="refund-details__text">{renderValue(0)}</dd>
        </Box>
      </Box>
    </div>
  );
};
