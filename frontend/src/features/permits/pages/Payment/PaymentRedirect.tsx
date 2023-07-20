import { useEffect, useState } from "react";
import { SuccessPage } from "../SuccessPage/SuccessPage";
import { getURLParameters } from "../../helpers/payment";
import { MotiPaymentDetails, Transaction } from "../../types/payment";
import { postTransaction } from "../../apiManager/permitsAPI";
import { Loading } from "../../../../common/pages/Loading";
import { AxiosError } from "axios";

/**
 * React component that handles the payment redirect and displays the payment status.
 * If the payment status is "Approved", it renders the SuccessPage component.
 * Otherwise, it displays the payment status message.
 */
export const PaymentRedirect = () => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [paymentStatus, setPaymentStatus] = useState<number>();
  const [message, setMessage] = useState<string>();
  const [transactionOrderNumber, setTransactionOrderNumber] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    const url = window.location.href;
    const parameters = getURLParameters(url);
    const transaction = mapTransactionDetails(parameters);
    setTransactionOrderNumber(transaction.transactionOrderNumber);
    handlePostTransaction(
      transaction,
      parameters.messageText,
      parameters.trnApproved
    );
  }, []);

  const onTransactionResult = (msg: string, payStatus: number) => {
    setMessage(msg);
    setPaymentStatus(payStatus);
    setIsLoading(false);
  };

  const handlePostTransaction = async (
    transaction: Transaction,
    messageText: string,
    isApproved: number
  ) => {
    if (isApproved === 0) {
      onTransactionResult(messageText, isApproved);
      return;
    }

    try {
      const result = await postTransaction(transaction);
      if (result.status === 201) {
        onTransactionResult(messageText, isApproved);
      } else {
        onTransactionResult("Something went wrong", 0);
      }
    } catch (err) {
      if (!(err instanceof AxiosError)) {
        onTransactionResult("Unknown Error", 0);
        return;
      }
      if (err.response) {
        onTransactionResult(
          `TODO: Payment approved but error in ORBC Backend: ${err.response.data.message}`, 
          0
        );
      } else {
        onTransactionResult("Request Error", 0);
      }
    }
  };

  if (isLoading) return <Loading />;

  return paymentStatus === 1 ? (
    <SuccessPage transactionOrderNumber={transactionOrderNumber} />
  ) : (
    <div>{message}</div>
  );
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
