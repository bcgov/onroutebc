import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { getPayBCPaymentDetails, getPaymentByTransactionId } from "../../helpers/payment";
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

  console.log('searchParams', searchParams.toString())

  const transactionId = getDefaultRequiredVal("", searchParams.get("ref2"));
  const [applicationIds, setApplicationIds] = useState<string[] | []>([]);
  const transactionQueryString = searchParams.toString();
  
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
    const ids:string[] = [];
    getPaymentByTransactionId(transactionId)
      .then((response) => {
        response?.applicationDetails?.forEach((application) => {
          if (application?.applicationId) {
            ids.push(application.applicationId)
          }
        })
      }).finally(() => {
        setApplicationIds(ids);
      })

  }, [transactionId]);

  useEffect(() => {
    if (applicationIds?.length > 0 && issuedPermit.current === false) {

      if (applicationIds?.length === 0) {
        // permit ids should not be empty, if so then something went wrong
        navigate(ERROR_ROUTES.UNEXPECTED, { replace: true });
      } else if (paymentApproved === true) {
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
  }, [paymentApproved, applicationIds]);

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
