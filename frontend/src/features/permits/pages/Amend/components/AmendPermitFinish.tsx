import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./AmendPermitFinish.scss";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { SnackBarContext } from "../../../../../App";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { RefundErrorModal } from "../../Refund/components/RefundErrorModal";
import { RefundPage, PERMIT_REFUND_ACTIONS } from "../../Refund/RefundPage";

import { isValidTransaction } from "../../../helpers/payment";
import { hasPermitsActionFailed } from "../../../helpers/permitState";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";
import { DEFAULT_PERMIT_TYPE } from "../../../types/PermitType";
import { ERROR_ROUTES } from "../../../../../routes/constants";

import { useIssuePermits, useStartTransaction } from "../../../hooks/hooks";
import { useRefundPermitMutation } from "../../Refund/hooks/useRefundPermit";
import { RefundFormData } from "../../Refund/types/RefundFormData";
import {
  mapToRefundRequestData,
  mapToZeroDollarRefundRequestData,
} from "../../Refund/helpers/mapper";
import { useFetchSpecialAuthorizations } from "../../../../settings/hooks/specialAuthorizations";
import { usePolicyEngine } from "../../../../policy/hooks/usePolicyEngine";
import { useCalculateRefundAmount } from "../../../hooks/useCalculateRefundAmount";
import { serializePermitData } from "../../../helpers/serialize/serializePermitData";
import { isZeroAmount } from "../../../helpers/feeSummary";

export const AmendPermitFinish = () => {
  const navigate = useNavigate();
  const { companyId: companyIdParam } = useParams();
  const companyId = applyWhenNotNullable((id) => Number(id), companyIdParam, 0);

  const {
    permit,
    amendmentApplication,
    permitHistory,
    getLinks,
    afterFinishAmend,
  } = useContext(AmendPermitContext);
  const { setSnackBar } = useContext(SnackBarContext);

  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const permitId = getDefaultRequiredVal("", amendmentApplication?.permitId);
  const permitType = getDefaultRequiredVal(
    DEFAULT_PERMIT_TYPE,
    amendmentApplication?.permitType,
    permit?.permitType,
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

  const [showRefundErrorModal, setShowRefundErrorModal] = useState(false);

  // Refund mutation
  const { mutation: refundPermitMutation, transaction: refundTransaction } =
    useRefundPermitMutation();

  const {
    mutation: startTransactionMutation,
    transaction: paymentTransaction,
  } = useStartTransaction();

  const handleFinish = (refundData: RefundFormData[]) => {
    const totalRefundAmount = refundData.reduce(
      (sum: number, transaction: RefundFormData) =>
        sum + Number(transaction.refundAmount),
      0,
    );

    if (totalRefundAmount !== Math.abs(amountToRefund)) {
      setShowRefundErrorModal(true);
      return;
    }

    if (isZeroAmount(amountToRefund)) {
      startTransactionMutation.mutate(
        mapToZeroDollarRefundRequestData(permitId),
      );
    } else {
      refundPermitMutation.mutate({
        applicationId: permitId,
        transactions: mapToRefundRequestData(refundData),
      });
    }
  };

  const handleCloseRefundErrorModal = () => {
    setShowRefundErrorModal(false);
  };

  // Permit issuance mutation
  const { mutation: issuePermitMutation, issueResults } = useIssuePermits();

  useEffect(() => {
    if (refundTransaction !== undefined) {
      if (!refundTransaction) {
        console.error("Refund failed.");
        navigate(ERROR_ROUTES.UNEXPECTED);
      } else {
        issuePermitMutation.mutate({
          companyId,
          applicationIds: [permitId],
        });
      }
    }
  }, [refundTransaction, permitId, companyId]);

  useEffect(() => {
    if (paymentTransaction !== undefined) {
      if (!paymentTransaction) {
        console.error("Payment failed.");
        navigate(ERROR_ROUTES.UNEXPECTED);
      } else {
        issuePermitMutation.mutate({
          companyId,
          applicationIds: [permitId],
        });
      }
    }
  }, [paymentTransaction, permitId, companyId]);

  useEffect(() => {
    const issueFailed = hasPermitsActionFailed(issueResults);
    if (issueFailed) {
      console.error("Permit issuance failed.");
      navigate(ERROR_ROUTES.UNEXPECTED);
    } else if (getDefaultRequiredVal(0, issueResults?.success?.length) > 0) {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Permit Amended",
        alertType: "success",
      });
      // TODO implement conditional navigation to Active Permits tab or Global permit search screen based on user journey
      afterFinishAmend();
    }
  }, [issueResults, navigate, setSnackBar]);

  return (
    <div className="amend-permit-finish">
      <Breadcrumb links={getLinks()} />

      <RefundPage
        permitHistory={validTransactionHistory}
        amountToRefund={amountToRefund}
        permitNumber={permit?.permitNumber}
        permitAction={PERMIT_REFUND_ACTIONS.AMEND}
        handleFinish={handleFinish}
        disableSubmitButton={
          refundPermitMutation.isPending ||
          startTransactionMutation.isPending ||
          issuePermitMutation.isPending
        }
      />

      {showRefundErrorModal && (
        <RefundErrorModal
          isOpen={showRefundErrorModal}
          onCancel={handleCloseRefundErrorModal}
          onConfirm={handleCloseRefundErrorModal}
        />
      )}
    </div>
  );
};
