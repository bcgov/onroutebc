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
import { InternalServerErrorException, Logger } from '@nestjs/common';

export const deleteLocalFile = (fileName: string) => {
  fs.rmSync(fileName);
};

export const createGarmsCashFile = (
  transactions: Transaction[],
  garmsExtractType: GarmsExtractType,
  permitServiceCodes: Map<string, number>,
  logger: Logger,
) => {
  const datetime = new Date().getMilliseconds();
  try {
    const fileName = path.join('/tmp', 'GARMS_CASH_FILE_' + datetime);
    const groupedTransactionsByDate: DateTransaction[] =
      groupTransactionsByDate(transactions);
    if (groupTransactionsByDate && groupedTransactionsByDate.length > 0) {
      groupedTransactionsByDate.forEach((transactionByDate) => {
        const permitTypeAmounts = new Map<number, number>();
        const permitTypeCount = new Map<number, number>();
        const paymentTypeAmounts = new Map<string, number>();
        const transactions = transactionByDate.transactions as Transaction[];
        transactions.forEach((transaction) => {
          processPaymentMethod(transaction, paymentTypeAmounts);
          processPermitTransactions(
            transaction,
            permitTypeAmounts,
            permitTypeCount,
            garmsExtractType,
            permitServiceCodes,
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
          fileName,
        );
      });
      return fileName;
    }
  } catch (err) {
    logger.error(err);
    throw new InternalServerErrorException(
      `Garms ${garmsExtractType} File Creation Failed on ${datetime}`,
    );
  }
};

export const createGarmsCashFileHeader = (
  paymentTypeAmounts: Map<string, number>,
  date: string,
  permitTypeCount: Map<number, number>,
  seqNumber: number,
  fileName: string,
) => {
  const gch = new GarmaCashHeader();
  gch.recType = HEADER_REC_TYPE;
  gch.agentNumber = AGENT_NUMBER;
  gch.wsdate = dateFormat(date, GARMS_DATE_FORMAT);
  gch.recCount = formatRecCount(seqNumber);
  gch.revAmount = formatAmount(getTotalAmount(paymentTypeAmounts));
  gch.totalCashAmount = formatAmount(
    getValue(paymentTypeAmounts, PaymentMethodType.CASH),
  );
  gch.totalChequeAmount = formatAmount(
    getValue(paymentTypeAmounts, PaymentMethodType.CHEQUE),
  );
  gch.totalDebitCardAmount = formatAmount(
    getValue(paymentTypeAmounts, PaymentCardType.DEBIT),
  );
  gch.totalVisaAmount = formatAmount(
    getValue(paymentTypeAmounts, PaymentCardType.VISA),
  );
  gch.totalMasterCardAmount = formatAmount(
    getValue(paymentTypeAmounts, PaymentCardType.MASTERCARD),
  );
  gch.totalAmexAmount = formatAmount(
    getValue(paymentTypeAmounts, PaymentCardType.AMEX),
  );
  gch.totalUSAmount = US_AMOUNT;
  gch.totalUSExchangeAmount = US_EXC_AMOUNT;
  gch.totalGAAmount = formatAmount(
    getValue(paymentTypeAmounts, PaymentMethodType.GA),
  );
  gch.serviceQuantity = formatServiceQuantity(
    getServiceQuantity(permitTypeCount),
  );
  gch.invQuantity = INV_QTY;
  const header = Object.values(gch).join('');
  fs.appendFileSync(fileName, header + '\n');
};

export const createGarmsCashFileDetails = (
  permitTypeCount: Map<number, number>,
  permitTypeAmounts: Map<number, number>,
  date: string,
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
    gcd.serviceCode = formatServiceCode(key);
    gcd.serviceQuantity = formatServiceQuantity(
      getValueNumber(permitTypeCount, key),
    );
    gcd.invUnits = INV_UNITS;
    gcd.revAmount = formatAmount(parseFloat(value.toFixed(2)));
    gcd.serNoFrom = SER_NO_FROM;
    gcd.serNoTo = SER_NO_TO;
    gcd.voidInd = VOID_IND;
    gcd.f1 = GARMS_CASH_FILLER;
    const details = Object.values(gcd).join('');
    fs.appendFileSync(fileName, details + '\n');
  });
};

export const processPermitTransactions = (
  transaction: Transaction,
  permitTypeAmounts: Map<number, number>,
  permitTypeCount: Map<number, number>,
  garmsExtractType: GarmsExtractType,
  permitServiceCodes: Map<string, number>,
) => {
  transaction.permitTransactions.forEach((permitTransaction) => {
    const permitType = permitTransaction.permit.permitType;
    const paymentAmount = getPaymentAmount(transaction);

    updateMapServiceCode(
      permitTypeAmounts,
      permitType,
      paymentAmount,
      permitServiceCodes,
    );

    if (garmsExtractType === GarmsExtractType.CASH) {
      updateMapServiceCode(permitTypeCount, permitType, 1, permitServiceCodes);
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
  const groupedData = transactions.reduce(
    (acc, transaction) => {
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
    },
    {} as Record<string, Transaction[]>,
  );

  //Process the grouped data (example: sum the total amounts for each date)
  const result = Object.keys(groupedData).map((date) => {
    const transactionsForDate = groupedData[date];
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

// Helper function to update amounts in the Map
export const updateMapServiceCode = (
  map: Map<number, number>,
  key: string,
  amount: number,
  permitServiceCodes: Map<string, number>,
) => {
  return map.set(
    permitServiceCodes.get(key),
    (map.get(permitServiceCodes.get(key)) || 0) + amount,
  );
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

export const getValueNumber = (
  map: Map<number, number>,
  key: number,
): number => {
  return map.has(key) ? map.get(key) : 0;
};

export const getServiceQuantity = (map: Map<number, number>) => {
  let sum = 0;
  map.forEach((value) => {
    sum += value;
  });

  return sum;
};

export const getTotalAmount = (map: Map<string, number>) => {
  let sum = 0;
  map.forEach((value) => {
    sum += value;
  });

  return sum;
};
