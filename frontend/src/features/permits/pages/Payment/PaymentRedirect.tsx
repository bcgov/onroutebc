import { useEffect, useRef } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { getPayBCPaymentDetails } from "../../helpers/payment";
import { Loading } from "../../../../common/pages/Loading";
import { useCompleteTransaction, useIssuePermits } from "../../hooks/hooks";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { DATE_FORMATS, toUtc } from "../../../../common/helpers/formatDate";
import {
  APPLICATIONS_ROUTES,
  ERROR_ROUTES,
  PERMITS_ROUTES,
} from "../../../../routes/constants";
import { PaymentCardTypeCode } from "../../../../common/types/paymentMethods";
import { Nullable } from "../../../../common/types/common";
import {
  CompleteTransactionRequestData,
  PayBCPaymentDetails,
} from "../../types/payment";

const PERMIT_ID_DELIM = ",";
const PATH_DELIM = "?";

const getPermitIdsArray = (permitIds?: Nullable<string>) => {
  return getDefaultRequiredVal("", permitIds)
    .split(PERMIT_ID_DELIM)
    .filter((id) => id !== "");
};

export const parseRedirectUriPath = (path?: Nullable<string>) => {
  const splitPath = path?.split(PATH_DELIM);
  let permitIds = "";
  let trnApproved = 0;
  if (splitPath?.[0]) {
    permitIds = splitPath[0];
  }

  if (splitPath?.[1]) {
    trnApproved = parseInt(splitPath[1]?.split("=")?.[1]);
  }

  return { permitIds, trnApproved };
};

const exportPathFromSearchParams = (
  params: URLSearchParams,
  trnApproved: number,
) => {
  const localParams = new URLSearchParams(params);
  localParams.delete("path");
  const updatedPath = localParams.toString();
  return encodeURIComponent(`trnApproved=${trnApproved}&` + updatedPath);
};

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

  const path = getDefaultRequiredVal("", searchParams.get("path"));
  const { permitIds, trnApproved } = parseRedirectUriPath(path);
  const transactionQueryString = exportPathFromSearchParams(
    searchParams,
    trnApproved,
  );
  const transactionId = getDefaultRequiredVal("", searchParams.get("ref2"));

  const { mutation: completeTransactionMutation, paymentApproved } =
    useCompleteTransaction(
      paymentDetails.messageText,
      paymentDetails.trnApproved,
    );

  const { mutation: issuePermitsMutation, issueResults } = useIssuePermits();

  const issueFailed = () => {
    if (!issueResults) return false; // since issue results might not be ready yet
    return (
      issueResults.success.length === 0 ||
      (issueResults.success.length === 1 && issueResults.success[0] === "") ||
      (issueResults.failure.length > 0 && issueResults.failure[0] !== "")
    );
  };

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
    if (issuedPermit.current === false) {
      const permitIdsArray = getPermitIdsArray(permitIds);

      if (permitIdsArray.length === 0) {
        // permit ids should not be empty, if so then something went wrong
        navigate(ERROR_ROUTES.UNEXPECTED, { replace: true });
      } else if (paymentApproved === true) {
        // Payment successful, proceed to issue permit
        issuePermitsMutation.mutate(permitIdsArray);
        issuedPermit.current = true;
      } else if (paymentApproved === false) {
        // Payment failed, redirect back to pay now page
        navigate(APPLICATIONS_ROUTES.PAY(permitIdsArray[0], true), {
          replace: true,
        });
      }
    }
  }, [paymentApproved, permitIds]);

  if (issueResults) {
    if (issueFailed()) {
      return <Navigate to={`${ERROR_ROUTES.UNEXPECTED}`} replace={true} />;
    }
    return (
      <Navigate
        to={`${PERMITS_ROUTES.SUCCESS(issueResults.success[0])}`}
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
