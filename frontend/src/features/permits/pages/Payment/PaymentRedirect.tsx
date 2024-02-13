import { useEffect, useRef } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { getPayBCPaymentDetails, usePaymentByTransactionIdQuery } from "../../helpers/payment";
import { Loading } from "../../../../common/pages/Loading";
import { useCompleteTransaction, useIssuePermits } from "../../hooks/hooks";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { DATE_FORMATS, toUtc } from "../../../../common/helpers/formatDate";
import { hasPermitsActionFailed } from "../../helpers/permitState";
import { PaymentCardTypeCode } from "../../../../common/types/paymentMethods";
import {
  APPLICATIONS_ROUTES,
  ERROR_ROUTES,
  PERMITS_ROUTES,
} from "../../../../routes/constants";

import {
  CompleteTransactionRequestData,
  PayBCPaymentDetails,
} from "../../types/payment";

/**
 * React component that handles the payment redirect and displays the payment status.
 * If the payment status is "Approved", it renders the SuccessPage component.
 * Otherwise, it displays the payment status message.
 */
export const PaymentRedirect = () => {
  const navigate = useNavigate();
  const completedTransaction = useRef(false);
  const issuedPermit = useRef(false);
  const [searchParams] = useSearchParams();
  const paymentDetails = getPayBCPaymentDetails(searchParams);
  const transaction = mapTransactionDetails(paymentDetails);
  const transactionId = getDefaultRequiredVal("", searchParams.get("ref2"));
  const transactionQueryString = encodeURIComponent(searchParams.toString());
  const transactionIdQuery = usePaymentByTransactionIdQuery(transactionId);

  const { mutation: completeTransactionMutation, paymentApproved } =
    useCompleteTransaction(
      paymentDetails.messageText,
      paymentDetails.trnApproved,
    );

  const { mutation: issuePermitsMutation, issueResults } = useIssuePermits();
  const issueFailed = hasPermitsActionFailed(issueResults);

  useEffect(() => {
    if (completedTransaction.current === false) {
      completeTransactionMutation.mutate({
        transactionId: getDefaultRequiredVal("", transactionId),
        transactionQueryString,
        transactionDetails: transaction,
      });
      completedTransaction.current = true;
    }
  }, [paymentDetails.trnApproved]);

  useEffect(() => {

    const applicationIds:string[] = [];
    if (transactionIdQuery?.isSuccess && issuedPermit?.current === false) {
      
      transactionIdQuery?.data?.applicationDetails?.forEach((application) => {
        if (application?.applicationId) {
          applicationIds.push(application.applicationId);
        }
      })

      if (paymentApproved === true) {
        // Payment successful, proceed to issue permit
        issuePermitsMutation.mutate(applicationIds);
        issuedPermit.current = true;
      } else if (paymentApproved === false) {
        // Payment failed, redirect back to pay now page
        navigate(APPLICATIONS_ROUTES.PAY(applicationIds[0], true), {
          replace: true,
        });
      }
    }

if (transactionIdQuery?.isError)
      navigate(ERROR_ROUTES.UNEXPECTED, { replace: true });
    }
  }, [paymentApproved, transactionIdQuery]);

  if (issueFailed) {
    return <Navigate to={`${ERROR_ROUTES.UNEXPECTED}`} replace={true} />;
  }

  const successIds = getDefaultRequiredVal([], issueResults?.success);
  const hasValidIssueResults = successIds.length > 0;

  if (hasValidIssueResults) {
    return (
      <Navigate
        to={`${PERMITS_ROUTES.SUCCESS(successIds[0])}`}
        replace={true}
      />
    );
  }

  return <Loading />;
};

const mapTransactionDetails = (
  paymentResponse: PayBCPaymentDetails,
): CompleteTransactionRequestData => {
  const isValidCardType = paymentResponse.cardType !== "";

  const transactionDetails = {
    pgTransactionId: paymentResponse.trnId,
    pgApproved: Number(paymentResponse.trnApproved),
    pgAuthCode: paymentResponse.authCode,
    pgTransactionDate: toUtc(paymentResponse.trnDate, DATE_FORMATS.ISO8601),
    pgCvdId: paymentResponse.cvdId,
    pgPaymentMethod: paymentResponse.paymentMethod,
    pgMessageId: paymentResponse.messageId,
    pgMessageText: paymentResponse.messageText,
  };

  if (!isValidCardType) return transactionDetails;

  return {
    ...transactionDetails,
    pgCardType: paymentResponse.cardType as PaymentCardTypeCode,
  };
};
