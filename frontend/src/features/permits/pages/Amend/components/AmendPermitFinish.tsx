/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FieldValues } from "react-hook-form";

import "./AmendPermitFinish.scss";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { SnackBarContext } from "../../../../../App";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { RefundErrorModal } from "../../Refund/components/RefundErrorModal";
import { RefundPage, PERMIT_REFUND_ACTIONS } from "../../Refund/RefundPage";

import { calculateAmountToRefund } from "../../../helpers/feeSummary";
import { isValidTransaction } from "../../../helpers/payment";
import { hasPermitsActionFailed } from "../../../helpers/permitState";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";
import { DEFAULT_PERMIT_TYPE } from "../../../types/PermitType";
import {
  APPLICATIONS_ROUTES,
  ERROR_ROUTES,
} from "../../../../../routes/constants";

import { useIssuePermits } from "../../../hooks/hooks";
import { useRefundPermitMutation } from "../../Refund/hooks/hooks";
import { MultiplePaymentMethodRefundData } from "../../Refund/types/RefundFormData";
import { PAYMENT_METHOD_TYPE_CODE } from "../../../../../common/types/paymentMethods";
import { PERMIT_TABS } from "../../../types/PermitTabs";

export const AmendPermitFinish = () => {
  const navigate = useNavigate();
  const { companyId: companyIdParam } = useParams();
  const companyId = applyWhenNotNullable((id) => Number(id), companyIdParam, 0);

  const { permit, amendmentApplication, permitHistory, getLinks } =
    useContext(AmendPermitContext);
  const { setSnackBar } = useContext(SnackBarContext);

  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const permitId = getDefaultRequiredVal("", amendmentApplication?.permitId);
  const amountToRefund =
    -1 *
    calculateAmountToRefund(
      validTransactionHistory,
      getDefaultRequiredVal(
        0,
        amendmentApplication?.permitData?.permitDuration,
      ),
      getDefaultRequiredVal(
        DEFAULT_PERMIT_TYPE,
        amendmentApplication?.permitType,
        permit?.permitType,
      ),
    );

  const [showRefundErrorModal, setShowRefundErrorModal] = useState(false);

  // Refund mutation
  const { mutation: refundPermitMutation, transaction } =
    useRefundPermitMutation();

  const onSubmit = (data: FieldValues) => {
    console.log(data);
    const totalRefundAmount = data.reduce(
      (sum: number, transaction: MultiplePaymentMethodRefundData) =>
        sum + Number(transaction.refundAmount),
      0,
    );

    if (totalRefundAmount !== Math.abs(amountToRefund)) {
      setShowRefundErrorModal(true);
      return;
    }

    // console.log({
    //   applicationId: permitId,
    //   transactions: data.map(
    //     (transaction: MultiplePaymentMethodRefundData) => ({
    //       pgTransactionId: transaction.pgTransactionId,
    //       pgPaymentMethod: transaction.pgPaymentMethod,
    //       paymentCardTypeCode: transaction.paymentCardTypeCode,
    //       transactionAmount: Number(transaction.refundAmount),
    //       paymentMethodTypeCode:
    //         Number(transaction.refundAmount) === 0
    //           ? PAYMENT_METHOD_TYPE_CODE.NP
    //           : transaction.chequeRefund
    //             ? PAYMENT_METHOD_TYPE_CODE.CHEQUE
    //             : transaction.paymentMethodTypeCode,
    //     }),
    //   ),
    // });

    refundPermitMutation.mutate({
      applicationId: permitId,
      transactions: data.map(
        (transaction: MultiplePaymentMethodRefundData) => ({
          pgTransactionId: transaction.pgTransactionId,
          pgPaymentMethod: transaction.pgPaymentMethod,
          paymentCardTypeCode: transaction.paymentCardTypeCode,
          transactionAmount: Number(transaction.refundAmount),
          paymentMethodTypeCode:
            Number(transaction.refundAmount) === 0
              ? PAYMENT_METHOD_TYPE_CODE.NP
              : transaction.chequeRefund
                ? PAYMENT_METHOD_TYPE_CODE.CHEQUE
                : transaction.paymentMethodTypeCode,
        }),
      ),
    });
  };

  const handleCloseRefundErrorModal = () => {
    setShowRefundErrorModal(false);
  };

  // Permit issuance mutation
  const { mutation: issuePermitMutation, issueResults } = useIssuePermits();

  useEffect(() => {
    if (transaction !== undefined) {
      if (!transaction) {
        console.error("Refund failed.");
        navigate(ERROR_ROUTES.UNEXPECTED);
      } else {
        issuePermitMutation.mutate({
          companyId,
          applicationIds: [permitId],
        });
      }
    }
  }, [transaction, permitId, companyId]);

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
      navigate(APPLICATIONS_ROUTES.BASE, {
        state: {
          selectedTab: PERMIT_TABS.ACTIVE_PERMITS,
        },
      });
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
        onSubmit={onSubmit}
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
