import { TransactionType } from 'src/common/enum/transaction-type.enum';
import { Transaction } from 'src/modules/common/entities/transaction.entity';
import { GarmsExtractType } from 'src/modules/common/enum/garms-extract-type.enum';
import { DateTransaction } from 'src/modules/garms/dto/DateTransation.dto';

export const createGarmsCashFile = (
  transactions: Transaction[],
  garmsExtractType: GarmsExtractType,
) => {
  const groupedTransactionsByDate = groupTransactionsByDate(transactions);

  groupedTransactionsByDate.forEach((transactionByDate) => {
    console.log('transaction by date: ',transactionByDate);
    const permitTypeAmounts = new Map<string, number>();
    const permitTypeCount = new Map<string, number>();
    const paymentTypeAmounts = new Map<string, number>();
    const transactions = transactionByDate.transactions as Transaction[];
    transactions.forEach((transaction) => {
      processPaymentMethod(transaction, paymentTypeAmounts);
      processPermitTransactions(
        transaction,
        permitTypeAmounts,
        permitTypeCount,
        garmsExtractType,
      );
    });
    // Log the results
    console.log('Amount by permit type:', permitTypeAmounts);
    console.log('Amount by payment type:', paymentTypeAmounts);
    console.log('Count by permit type:', permitTypeCount);
  });
};

export const processPermitTransactions = (
  transaction: Transaction,
  permitTypeAmounts: Map<string, number>,
  permitTypeCount: Map<string, number>,
  garmsExtractType: GarmsExtractType,
) => {
  transaction.permitTransactions.forEach((permitTransaction) => {
    const permitType = permitTransaction.permit.permitType;
    const paymentAmount = getPaymentAmount(transaction);

    updateMap(permitTypeAmounts, permitType, paymentAmount);

    if (garmsExtractType === GarmsExtractType.CASH) {
      updateMap(permitTypeCount, permitType, 1);
    }
  });
};

export const processPaymentMethod = (
  transaction: Transaction,
  paymentTypeAmounts: Map<string, number>,
) => {
  const { paymentMethodTypeCode, paymentCardTypeCode } = transaction;

  if (paymentMethodTypeCode && paymentCardTypeCode) {
    const paymentType = paymentCardTypeCode;
    const paymentAmount = getPaymentAmount(transaction);
    updateMap(paymentTypeAmounts, paymentType, paymentAmount);
  } else if (paymentMethodTypeCode) {
    const paymentType = paymentMethodTypeCode;
    const paymentAmount = getPaymentAmount(transaction);
    updateMap(paymentTypeAmounts, paymentType, paymentAmount);
  }
};

export const getPreviousDayAtNinePM = (): Date => {
  const today = new Date();
  today.setDate(today.getDate() - 1); // Move to yesterday
  today.setHours(21, 0, 0, 0); // Set to 9 PM
  console.log('previous day 9 pm: ', today);
  return today;
};
// Determine the paymentType and transaction amount based on the condition
export const getPaymentAmount = (transaction: Transaction) => {
  const amount = transaction.totalTransactionAmount;
  const isRefundOrVoid =
    transaction.transactionTypeId === TransactionType.REFUND ||
    transaction.transactionTypeId === TransactionType.VOID_REFUND;
  return isRefundOrVoid ? -amount : amount;
};

export const groupTransactionsByDate = (transactions: Transaction[]) => {
  // Group transactions by the date (ignoring the time part)
  const groupedData = transactions.reduce((acc, transaction) => {
    // Extract just the date part (YYYY-MM-DD)
    const transactionDate = transaction.transactionSubmitDate.toISOString().split('T')[0];

    // If the date group doesn't exist, create it
    if (!acc[transactionDate]) {
      acc[transactionDate] = [];
    }

    // Add the transaction to the correct date group
    acc[transactionDate].push(transaction);

    return acc;
  }, {});

  //Process the grouped data (example: sum the total amounts for each date)
  const result = Object.keys(groupedData).map(date => {
    const transactionsForDate = groupedData[date] as Transaction[];
    const dateTransaction = new DateTransaction();
    dateTransaction.date= date;
    dateTransaction.transactions = [...transactionsForDate];;
    return dateTransaction;
  });

  return result;
};
// Helper function to update amounts in the Map
export const updateMap = (
  map: Map<string, number>,
  key: string,
  amount: number,
) => {
  return map.set(key, (map.get(key) || 0) + amount);
};
