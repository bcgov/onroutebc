import { useEffect, useState } from "react";
import { SuccessPage } from "../SuccessPage/SuccessPage";
import { getURLParameters } from "../../helpers/payment";
import { MotiPaymentDetails, Transaction } from "../../types/payment";
import { postTransaction } from "../../apiManager/permitsAPI";
import { Loading } from "../../../../common/pages/Loading";

/**
 * React component that handles the payment redirect and displays the payment status.
 * If the payment status is "Approved", it renders the SuccessPage component.
 * Otherwise, it displays the payment status message.
 */
export const PaymentRedirect = () => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [paymentStatus, setPaymentStatus] = useState<number>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    setIsLoading(true);
    const url = window.location.href;
    const parameters = getURLParameters(url);
    const transaction = mapTransactionDetails(parameters);
    handlePostTransaction(
      transaction,
      parameters.messageText,
      parameters.trnApproved
    );
  }, []);

  const handlePostTransaction = async (
    transaction: Transaction,
    messageText: string,
    isApproved: number
  ) => {
    if (isApproved == 0) {
      setPaymentStatus(isApproved);
      setMessage(messageText);
      setIsLoading(false);
      return;
    }

    const result = await postTransaction(transaction);

    if (result.status != 201) {
      console.log("Error: handlePostTransaction.", result);
      setMessage(`TODO: Payment approved but error in ORBC Backend: ${result.response.data.message}`);
      setPaymentStatus(0);
    } else {
      setMessage(messageText);
      setPaymentStatus(isApproved);
    }
    
    setIsLoading(false);
  };

  if (isLoading) return <Loading />;

  return paymentStatus === 1 ? <SuccessPage /> : <div>{message}</div>;
};

const mapTransactionDetails = (
  motiResponse: MotiPaymentDetails
): Transaction => {
  return {
    //transactionId: Number(motiResponse.trnId), // TODO check this and providerTransactionId
    transactionType: motiResponse.trnType,
    transactionOrderNumber: motiResponse.trnOrderNumber,
    providerTransactionId: Number(motiResponse.trnId),
    transactionAmount: Number(motiResponse.trnAmount),
    approved: Number(motiResponse.trnApproved),
    authCode: motiResponse.authCode,
    cardType: motiResponse.cardType,
    transactionDate: motiResponse.trnDate, // TODO
    cvdId: Number(motiResponse.cvdId),
    paymentMethod: motiResponse.paymentMethod,
    paymentMethodId: 1, // TODO: change once different payment methods are implemented
    messageId: motiResponse.messageId,
    messageText: motiResponse.messageText,
  };
};
