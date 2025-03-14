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
  console.log('deleting file: ',fs.readFileSync(fileName))
  fs.rmSync(fileName);
};

/**
 * Create GARMS CASH file
 * GRAMS cash file containd one heasder record for each date and multiple details record under one header.
 * These detail records belong to same date but are consolidated on the bases of different service code wrt permit type.
 * One file can contain multiple headers.
 * @param transactions
 * @param garmsExtractType
 * @param permitServiceCodes
 * @param logger
 * @returns
 */
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

/**
 * Create Header record for GARMS file
 * @param paymentTypeAmounts
 * @param date
 * @param permitTypeCount
 * @param seqNumber
 * @param fileName
 */
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
  gch.recCount = formatNumber(seqNumber, 6);
  gch.revAmount = formatAmount(getSum(paymentTypeAmounts));
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
  gch.serviceQuantity = formatNumber(getSum(permitTypeCount), 5);
  gch.invQuantity = INV_QTY;
  const header = Object.values(gch).join('');
  fs.appendFileSync(fileName, header + '\n');
};

/**
 * Create detail record fo GARMS file
 * @param permitTypeCount
 * @param permitTypeAmounts
 * @param date
 * @param fileName
 */
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
    gcd.seqNumber = formatNumber(seqNumber, 4);
    gcd.serviceCode = formatNumber(key, 4);
    gcd.serviceQuantity = formatNumber(getValue(permitTypeCount, key), 5);
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

/**
 * Consolidate details to report to garms file as follows:
 * Consolidate service codes wrt permit type into map permitServiceCodes
 * Consolidate amount wrt service codes into map permitTypeAmounts
 * Consolidate permit count wrt service codes into map permitTypeCount
 *
 * @param transaction
 * @param permitTypeAmounts
 * @param permitTypeCount
 * @param garmsExtractType
 * @param permitServiceCodes
 */
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

/**
 * Processes the payment method information from a transaction and updates the payment amounts in the given map.
 * The function checks the presence of `paymentMethodTypeCode` and `paymentCardTypeCode` in the transaction.
 * Based on the available information, it determines the payment type and the payment amount, then updates the
 * `paymentTypeAmounts` map with the corresponding payment type and amount.
 *
 * @param transaction The transaction object containing payment method details, including `paymentMethodTypeCode` and `paymentCardTypeCode`.
 * @param paymentTypeAmounts A Map that stores the payment types (as keys) and their corresponding payment amounts (as values).
 * @returns void
 */
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

/**
 * Groups transactions by the date part (YYYY-MM-DD), combines the transactions of the first two dates if possible,
 * ( Why we need to combine the data of first two dates: GARMS service runs at 11 pm and rejects transactions of same date
 * so all the transactions processed after garms scheduled run for that day, will be processsed as transaction from the following date)
 * and then returns an array of DateTransaction entities.
 *
 * @param transactions - The list of transactions to be grouped by date.
 * @returns An array of DateTransaction entities, each containing a date and the corresponding transactions.
 */
export const groupTransactionsByDate = (transactions: Transaction[]) => {
  // Group transactions by the date (ignoring the time part)
  const groupedData: Record<string, Transaction[]> = transactions.reduce(
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

  const dates = Object.keys(groupedData);
  // If there are less than 2 keys, just return the map as it is
  if (dates.length > 1) {
    // Combine the transactions of the first two dates
    const firstDate = dates[0];
    const secondDate = dates[1];
    const combinedTransactions = [
      ...groupedData[firstDate],
      ...groupedData[secondDate],
    ];

    // Remove both the first and second dates
    delete groupedData[firstDate];
    delete groupedData[secondDate];

    // Set the combined transactions under the second date
    groupedData[secondDate] = combinedTransactions;
  }

  // Convert grouped data into DateTransaction entities
  return Object.entries(groupedData).map(([date, transactions]) => {
    const dateTransaction = new DateTransaction();
    dateTransaction.date = date;
    dateTransaction.transactions = transactions;
    return dateTransaction;
  });
};

/**
 * Helper function to update the amount associated with a specific key in the map.
 * If the key exists, the function adds the specified amount to the current value.
 * If the key does not exist, the function initializes the key with the given amount.
 *
 * @param map A Map that associates string keys with numeric values.
 * @param key The key whose value needs to be updated.
 * @param amount The amount to be added to the current value associated with the key.
 * @returns The updated map with the new value for the specified key.
 */
export const updateMap = (
  map: Map<string, number>,
  key: string,
  amount: number,
) => {
  return map.set(key, (map.get(key) || 0) + amount);
};

/**
 * Updates the value associated with a specific service code in the provided map.
 * The function looks up the service code in the `permitServiceCodes` map using the provided key.
 * If the service code exists, it updates the value in the `map` by adding the specified `amount`or `count`.
 * If the service code does not exist in the `map`, it initializes the value with the `amount` or `count`.
 *
 * @param map A Map where service codes are stored with their associated numeric values.
 * @param key The key used to look up the service code in the `permitServiceCodes` map.
 * @param amount The amount to be added to the current value associated with the service code.
 * @param permitServiceCodes A Map that maps the key to a corresponding service code.
 * @returns The updated `map` with the modified value for the specified service code.
 */
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

/**
 * Formats a given amount into a standardized string representation.
 * - If the amount is positive, it formats the number with 2 decimal places, pads it to a length of 10 characters,
 *   and appends a space at the end.
 * - If the amount is zero, it returns a specific string representing zero ('0000000.00 ').
 * - If the amount is negative, it formats the absolute value with 2 decimal places, pads it to a length of 10 characters,
 *   and appends a minus sign ('-') at the end.
 *
 * @param amount The numeric value to be formatted.
 * @returns A string representation of the formatted amount.
 */
export const formatAmount = (amount: number) => {
  if (amount > 0) return amount.toFixed(2).padStart(10, '0') + ' ';
  else if (amount === 0) return '0000000.00 ';
  else return Math.abs(amount).toFixed(2).padStart(10, '0') + '-';
};

/**
 * Formats a number by padding it with leading zeros to ensure it meets the specified length.
 * If the number is already the specified length or longer, it remains unchanged.
 *
 * @param value The number to be formatted.
 * @param length The desired length of the resulting string.
 * @returns A string representation of the number, padded with leading zeros to the specified length.
 */
export const formatNumber = (value: number, length: number) => {
  return value.toString().padStart(length, '0');
};

/**
 * Retrieves the value associated with a specific key from a map.
 * If the key exists in the map, the corresponding value is returned.
 * If the key does not exist, the method returns 0.
 *
 * @param map A Map that associates keys (of type K) with numeric values.
 * @param key The key to look up in the map (of type K).
 * @returns The value associated with the key if it exists; otherwise, returns 0.
 */
export const getValue = <K>(map: Map<K, number>, key: K): number => {
  return map.has(key) ? map.get(key) : 0;
};

/**
 * Calculates the sum of all values in a map.
 * This method iterates over the map and adds up the values associated with each key.
 *
 * @param map A Map where the keys are of type K and the values are numbers.
 * @returns The sum of all values in the map.
 */
export const getSum = <K>(map: Map<K, number>) => {
  let sum = 0;
  map.forEach((value) => {
    sum += value;
  });

  return sum;
};
