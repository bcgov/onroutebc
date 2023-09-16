import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { feeSummaryDisplayText } from "../../../helpers/feeSummary";
import "./TransactionHistoryTable.scss";

export const TransactionHistoryTable = ({
  transactionHistory,
}: {
  transactionHistory: {
    permitNumber: string;
    paymentMethod?: number;
    transactionId?: string;
    amount?: number;
  }[];
}) => {
  const permitNumbers = transactionHistory.map(transaction => transaction.permitNumber);
  const paymentMethods = transactionHistory.map(transaction => transaction.paymentMethod);
  const transactionIds = transactionHistory.map(transaction => transaction.transactionId);
  const amounts = transactionHistory.map(transaction => transaction.amount);

  const availablePaymentMethods = [
    {
      value: 2,
      label: "Icepay - Mastercard (Debit)",
    },
  ]; // hardcoded

  const getPaymentMethodText = (payMethod?: number) => {
    return getDefaultRequiredVal(
      "NA",
      availablePaymentMethods.find(method => method.value === payMethod)?.label
    );
  };

  return (
    <div className="transaction-history-table">
      <div className="transaction-history-table__col transaction-history-table__col--permit">
        <div className="table-row table-row--header">Permit #</div>
        {permitNumbers.map(permitNumber => (
          <div 
            key={permitNumber} 
            className="table-row"
          >
            {permitNumber}
          </div>
        ))}
      </div>
      <div className="transaction-history-table__col transaction-history-table__col--payment">
        <div className="table-row table-row--header">Payment Method</div>
        {paymentMethods.map((paymentMethod, i) => (
          <div 
            key={`${permitNumbers[i]}-payment-method`} 
            className="table-row"
          >
            {getPaymentMethodText(paymentMethod)}
          </div>
        ))}
      </div>
      <div className="transaction-history-table__col transaction-history-table__col--transaction">
        <div className="table-row table-row--header">Transaction ID</div>
        {transactionIds.map((transactionId, i) => (
          <div 
          key={`${permitNumbers[i]}-transaction-id`} 
            className="table-row"
          >
            {getDefaultRequiredVal("NA", transactionId)}
          </div>
        ))}
      </div>
      <div className="transaction-history-table__col transaction-history-table__col--amount">
        <div className="table-row table-row--header">Amount (CAD)</div>
        {amounts.map((amount, i) => (
          <div 
            key={`${permitNumbers[i]}-amount`} 
            className="table-row"
          >
            {feeSummaryDisplayText(
              applyWhenNotNullable((val) => `${val}`, amount)
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
