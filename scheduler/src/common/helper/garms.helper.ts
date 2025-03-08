import {
  AGENT_NUMBER,
  DETAIL_REC_TYPE,
  GARMS_CASH_FILLER,
  GARMS_DATE_FORMAT,
  HEADER_REC_TYPE,
  INV_QTY,
  INV_UNITS,
  SER_NO_FROM,
  SER_NO_TO,
  US_AMOUNT,
  US_EXC_AMOUNT,
  VOID_IND,
} from 'src/common/constants/garms.constant';
import { PaymentCardType } from 'src/common/enum/payment-card-type.enum';
import { PaymentMethodType } from 'src/common/enum/payment-method-type.enum';
import { TransactionType } from 'src/common/enum/transaction-type.enum';
import { Transaction } from 'src/modules/common/entities/transaction.entity';
import { GarmsExtractType } from 'src/modules/common/enum/garms-extract-type.enum';
import { DateTransaction } from 'src/modules/garms/dto/DateTransation.dto';
import { GarmaCashDetail } from 'src/modules/garms/dto/garms-cash-details.dto';
import { GarmaCashHeader } from 'src/modules/garms/dto/garms-cash-header.dto';
import { dateFormat } from './date-time.helper';
import * as fs from 'fs';
import * as path from 'path';

export const createGarmsCashFile = (
  transactions: Transaction[],
  garmsExtractType: GarmsExtractType,
  permitServiceCodes: Map<string, number>,
) => {
  const datetime = new Date().getMilliseconds();
  const fileName = path.join('/tmp', 'GARMS_CASH_FILE_' + datetime);
  const groupedTransactionsByDate = groupTransactionsByDate(transactions);
  groupedTransactionsByDate.forEach((transactionByDate) => {
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
    const sequenceNumber = permitTypeCount.size;
    createGarmsCashFileHeader(
      paymentTypeAmounts,
      transactionByDate.date,
      permitTypeCount,
      sequenceNumber,
      fileName,
    );
    createGarmsCashFileDetails(
      permitTypeCount,
      permitTypeAmounts,
      transactionByDate.date,
      permitServiceCodes,
      fileName,
    );
  });
};

export const createGarmsCashFileHeader = (
  paymentTypeAmounts: Map<string, number>,
  date: string,
  permitTypeCount: Map<string, number>,
  seqNumber: number,
  fileName: string,
) => {
  const gch = new GarmaCashHeader();
  gch.recType = HEADER_REC_TYPE;
  gch.agentNumber = AGENT_NUMBER;
  gch.wsdate = dateFormat(date, GARMS_DATE_FORMAT);
  gch.recCount = formatRecCount(seqNumber);

  const paymentMethods = [
    PaymentMethodType.CASH,
    PaymentMethodType.CHEQUE,
    PaymentCardType.DEBIT,
    PaymentCardType.VISA,
    PaymentCardType.MASTERCARD,
    PaymentCardType.AMEX,
    PaymentMethodType.GA,
  ];

  let revAmount = 0;

  paymentMethods.forEach((paymentMethod) => {
    const amount = getValue(paymentTypeAmounts, paymentMethod);
    gch[`${paymentMethod}Amount`] = formatAmount(parseFloat(amount.toFixed(2)));
    revAmount += amount;
  });

  gch.revAmount = formatAmount(revAmount);
  gch.totalUSAmount = US_AMOUNT;
  gch.totalUSExchangeAmount = US_EXC_AMOUNT;
  gch.totalGAAmount = formatAmount(parseFloat(getValue(paymentTypeAmounts, PaymentMethodType.GA).toFixed(2)));
  gch.serviceQuantity = formatServiceQuantity(getServiceQuantity(permitTypeCount));
  gch.invQuantity = INV_QTY;

  const header = Object.values(gch).join('');
  fs.appendFileSync(fileName, header);
};
export const createGarmsCashFileDetails = (
  permitTypeCount: Map<string, number>,
  permitTypeAmounts: Map<string, number>,
  date: string,
  permitServiceCodes: Map<string, number>,
  fileName: string,
) => {
  let seqNumber = 0;
  permitTypeAmounts.forEach((value, key) => {
    seqNumber = seqNumber + 1;
    const gcd = new GarmaCashDetail();
    gcd.recType = DETAIL_REC_TYPE;
    gcd.agentNumber = AGENT_NUMBER;
    gcd.wsdate = dateFormat(date, GARMS_DATE_FORMAT);
    gcd.seqNumber = formatSequenceNumber(seqNumber);
    gcd.serviceCode = formatServiceCode(getValue(permitServiceCodes, key));
    gcd.serviceQuantity = formatServiceQuantity(getValue(permitTypeCount, key));
    gcd.invUnits = INV_UNITS;
    gcd.revAmount = formatAmount(parseFloat(value.toFixed(2)));
    gcd.serNoFrom = SER_NO_FROM;
    gcd.serNoTo = SER_NO_TO;
    gcd.voidInd = VOID_IND;
    gcd.f1 = GARMS_CASH_FILLER;
    const details =
      gcd.recType +
      gcd.agentNumber +
      gcd.wsdate +
      gcd.seqNumber +
      gcd.serviceCode +
      gcd.serviceQuantity +
      gcd.invUnits +
      gcd.revAmount +
      gcd.serNoFrom +
      gcd.serNoTo +
      gcd.voidInd +
      gcd.f1;
    fs.appendFileSync(fileName, details, 'utf8');
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
    const transactionDate = transaction.transactionSubmitDate
      .toISOString()
      .split('T')[0];

    // If the date group doesn't exist, create it
    if (!acc[transactionDate]) {
      acc[transactionDate] = [];
    }

    // Add the transaction to the correct date group
    acc[transactionDate].push(transaction);

    return acc;
  }, {});

  //Process the grouped data (example: sum the total amounts for each date)
  const result = Object.keys(groupedData).map((date) => {
    const transactionsForDate = groupedData[date] as Transaction[];
    const dateTransaction = new DateTransaction();
    dateTransaction.date = date;
    dateTransaction.transactions = [...transactionsForDate];
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
export const formatAmount = (amount: number) => {
  if (amount > 0) return amount.toFixed(2).padStart(10, '0') + ' ';
  else if (amount === 0) return '0000000.00 ';
  else return Math.abs(amount).toFixed(2).padStart(10, '0') + '-';
};
export const formatSequenceNumber = (seqNumber: number) => {
  return seqNumber.toString().padStart(4, '0');
};
export const formatServiceCode = (serviceCode: number) => {
  return serviceCode.toString().padStart(4, '0');
};
export const formatServiceQuantity = (serviceQty: number) => {
  return serviceQty.toString().padStart(5, '0');
};
export const formatRecCount = (recCount: number) => {
  return recCount.toString().padStart(6, '0');
};
export const getValue = (map: Map<string, number>, key: string): number => {
  return map.has(key) ? map.get(key) : 0;
};
export const getServiceQuantity = (map: Map<string, number>) => {
  let sum = 0;
  map.forEach((value) => {
    sum += value;
  });

  return sum;
};
