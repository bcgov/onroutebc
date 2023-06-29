import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { IPayment } from './interface/payment.interface';

@Injectable()
export class PaymentService {
  /**
   * Generates a hash and other necessary values for a transaction.
   *
   * @param {string} transactionAmount - The amount of the transaction.
   * @returns {object} An object containing the transaction number, hash expiry, and hash.
   */
  private createHash = (transactionAmount: string) : IPayment => {
    // Get the current date and time
    const currDate = new Date();

    // Generate a unique transaction number based on the current timestamp
    const trnNum = 'T' + currDate.getTime().toString();
    const transactionNumber = trnNum;

    // Giving our hash expiry a value of current date plus 10 minutes which is sufficient
    const hashExpiryDt = new Date(currDate.getTime() + 10 * 60000);

    // Extract the year, month, day, hours, and minutes from the hash expiry date
    const year = hashExpiryDt.getFullYear();
    const monthPadded = ('00' + (hashExpiryDt.getMonth() + 1).toString()).slice(-2);
    const dayPadded = ('00' + hashExpiryDt.getDate().toString()).slice(-2);
    const hoursPadded = ('00' + hashExpiryDt.getHours().toString()).slice(-2);
    const minutesPadded = ('00' + hashExpiryDt.getMinutes().toString()).slice(-2);

    // Create the hash expiry string in the format "YYYYMMDDHHmm"
    const hashExpiry = `${year}${monthPadded}${dayPadded}${hoursPadded}${minutesPadded}`;
    const motipayHashExpiry = hashExpiry;

    // There should be a better way of doing this which is not as rigid - something like
    // dynamically removing the hashValue param from the actual query string instead of building
    // it up manually below, but this is sufficient for now.
    const queryString = `merchant_id=${process.env.MOTIPAY_MERCHANT_ID}&trnType=P&trnOrderNumber=${transactionNumber}&trnAmount=${transactionAmount}&approvedPage=${process.env.MOTIPAY_REDIRECT}&declinedPage=${process.env.MOTIPAY_REDIRECT}${process.env.MOTIPAY_API_KEY}`;

    // Generate the hash using the query string and the MD5 algorithm
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const motiPayHash : string = CryptoJS.MD5(queryString).toString();

    return {
      transactionNumber: transactionNumber,
      motipayHashExpiry: motipayHashExpiry,
      motipayHash: motiPayHash,
    };
  };

  /**
   * Generates a URL with transaction details for forwarding the user to the payment gateway.
   *
   * @param {Application} termOversizePermit - The term oversize permit application object.
   * @returns {string} The URL containing transaction details for the payment gateway.
   */
  forwardTransactionDetails = (transactionAmount: number): string => {
    // Generate the hash and other necessary values for the transaction
    const hash = this.createHash(transactionAmount.toString());
    const motipayHash = hash.motipayHash;
    const transactionNumber = hash.transactionNumber;

    // Construct the URL with the transaction details for the payment gateway
    return `${process.env.MOTIPAY_BASE_URL}?merchant_id=${process.env.MOTIPAY_MERCHANT_ID}&trnType=P&trnOrderNumber=${transactionNumber}&trnAmount=${transactionAmount}&approvedPage=${process.env.MOTIPAY_REDIRECT}&declinedPage=${process.env.MOTIPAY_REDIRECT}&hashValue=${motipayHash}`;
  };
}
