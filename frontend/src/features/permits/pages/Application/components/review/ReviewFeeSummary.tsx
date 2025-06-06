import { Box, Typography } from "@mui/material";

import "./ReviewFeeSummary.scss";
import { ConfirmationCheckboxes } from "./ConfirmationCheckboxes";
import { FeeSummary } from "../../../../components/feeSummary/FeeSummary";
import { DEFAULT_PERMIT_TYPE, PermitType } from "../../../../types/PermitType";
import { Nullable } from "../../../../../../common/types/common";
import {
  PERMIT_REVIEW_CONTEXTS,
  PermitReviewContext,
} from "../../../../types/PermitReviewContext";
import { useContext } from "react";
import { AmendPermitContext } from "../../../Amend/context/AmendPermitContext";
import { isValidTransaction } from "../../../../helpers/payment";
import { calculateNetAmount } from "../../../../helpers/feeSummary";
import { useParams } from "react-router-dom";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../../common/helpers/util";
import { useFetchSpecialAuthorizations } from "../../../../../settings/hooks/specialAuthorizations";
import { usePolicyEngine } from "../../../../../policy/hooks/usePolicyEngine";
import { useCalculateRefundAmount } from "../../../../hooks/useCalculateRefundAmount";
import { serializePermitData } from "../../../../helpers/serialize/serializePermitData";
import { AmendOrVoidFeeSummary } from "../../../../components/amendOrVoidFeeSummary/AmendOrVoidFeeSummary";

export const ReviewFeeSummary = ({
  hasAttemptedSubmission,
  areAllConfirmed,
  setAreAllConfirmed,
  permitType,
  fee,
  reviewContext,
}: {
  hasAttemptedSubmission: boolean;
  areAllConfirmed: boolean;
  setAreAllConfirmed: (allConfirmed: boolean) => void;
  permitType?: Nullable<PermitType>;
  fee: string;
  reviewContext: PermitReviewContext;
}) => {
  const isAmendAction = reviewContext === PERMIT_REVIEW_CONTEXTS.AMEND;

  const { amendmentApplication, permitHistory } =
    useContext(AmendPermitContext);

  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const currentPermitValue = calculateNetAmount(validTransactionHistory);

  const { companyId: companyIdParam } = useParams();
  const companyId: number = applyWhenNotNullable(
    (id) => Number(id),
    companyIdParam,
    0,
  );

  permitType = getDefaultRequiredVal(
    DEFAULT_PERMIT_TYPE,
    amendmentApplication?.permitType,
    permitType,
  );

  const { data: specialAuthorizations } =
    useFetchSpecialAuthorizations(companyId);
  const policyEngine = usePolicyEngine(specialAuthorizations);
  const calculatedRefundAmount = useCalculateRefundAmount(
    validTransactionHistory,
    {
      permitType,
      permitData: amendmentApplication?.permitData
        ? serializePermitData(amendmentApplication.permitData)
        : {},
    },
    policyEngine,
  );

  const amountToRefund = -1 * calculatedRefundAmount;

  // amountToRefund is a negative number so we add here rather than subtract
  const newPermitValue = currentPermitValue + amountToRefund;

  return (
    <Box className="review-fee-summary">
      <Box className="review-fee-summary__header">
        <Typography variant={"h3"}></Typography>
      </Box>
      <Box className="review-fee-summary__body">
        <Box className="fee-summary-wrapper">
          {isAmendAction ? (
            <AmendOrVoidFeeSummary
              currentPermitValue={`${currentPermitValue}`}
              newPermitValue={`${newPermitValue}`}
              amountToRefund={`${amountToRefund}`}
            />
          ) : (
            <FeeSummary permitType={permitType} feeSummary={fee} />
          )}

          <ConfirmationCheckboxes
            hasAttemptedSubmission={hasAttemptedSubmission}
            areAllChecked={areAllConfirmed}
            setAreAllChecked={setAreAllConfirmed}
            shouldDisableCheckboxes={
              reviewContext === PERMIT_REVIEW_CONTEXTS.QUEUE
            }
          />
        </Box>
      </Box>
    </Box>
  );
};
