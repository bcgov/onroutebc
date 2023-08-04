import { HttpException, Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { IPayment } from '../../common/interface/payment.interface';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { ReadTransactionDto } from './dto/response/read-transaction.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermitTransaction } from './entities/permit-transaction.entity';
import { ReadPermitTransactionDto } from './dto/response/read-permit-transaction.dto';
import { MotiPayDetailsDto } from './dto/response/read-moti-pay-details.dto';
import { ApplicationService } from '../permit/application.service';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { IReceipt } from 'src/common/interface/receipt.interface';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PermitTransaction)
    private permitTransactionRepository: Repository<PermitTransaction>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectMapper() private readonly classMapper: Mapper,
    private applicationService: ApplicationService,
  ) {}

  private generateHashExpiry = (currDate?: Date) => {
    const curr = currDate ?? new Date();

    // Giving our hash expiry a value of current date plus 10 minutes which is sufficient
    const hashExpiryDt = new Date(curr.getTime() + 10 * 60000);

    // Extract the year, month, day, hours, and minutes from the hash expiry date
    const year = hashExpiryDt.getFullYear();
    const monthPadded = ('00' + (hashExpiryDt.getMonth() + 1).toString()).slice(
      -2,
    );
    const dayPadded = ('00' + hashExpiryDt.getDate().toString()).slice(-2);
    const hoursPadded = ('00' + hashExpiryDt.getHours().toString()).slice(-2);
    const minutesPadded = ('00' + hashExpiryDt.getMinutes().toString()).slice(
      -2,
    );

    // Create the hash expiry string in the format "YYYYMMDDHHmm"
    return `${year}${monthPadded}${dayPadded}${hoursPadded}${minutesPadded}`;
  };

  private queryHash = (
    transactionType: string,
    transactionNumber: string,
    transactionAmount: string,
    permitIds?: number[],
    transactionIds?: string[],
  ) => {
    // Construct the URL with the transaction details for the payment gateway
    const redirectUrl =
      permitIds && transactionIds
        ? `${process.env.MOTIPAY_REDIRECT}` +
          encodeURIComponent(
            `?permitIds=${permitIds.join(
              ',',
            )}&transactionIds=${transactionIds.join(',')}`,
          )
        : `${process.env.MOTIPAY_REDIRECT}`;

    // There should be a better way of doing this which is not as rigid - something like
    // dynamically removing the hashValue param from the actual query string instead of building
    // it up manually below, but this is sufficient for now.
    const queryString =
      `merchant_id=${process.env.MOTIPAY_MERCHANT_ID}` +
      `&trnType=${transactionType}` +
      `&trnOrderNumber=${transactionNumber}` +
      `&trnAmount=${transactionAmount}` +
      `&approvedPage=${redirectUrl}` +
      `&declinedPage=${redirectUrl}`;

    // Generate the hash using the query string and the MD5 algorithm
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const motiPayHash: string = CryptoJS.MD5(
      `${queryString}${process.env.MOTIPAY_API_KEY}`,
    ).toString();
    const hashExpiry = this.generateHashExpiry();

    return { queryString, motiPayHash, hashExpiry };
  };

  /**
   * Generates a hash and other necessary values for a transaction.
   *
   * @param {string} transactionAmount - The amount of the transaction.
   * @returns {object} An object containing the transaction number, hash expiry, and hash.
   */
  private createHash = (transactionAmount: string): IPayment => {
    // Get the current date and time
    const currDate = new Date();

    // TODO: Generate a unique transaction number based on the current timestamp
    const trnNum = 'T' + currDate.getTime().toString().substring(4);
    const transactionNumber = trnNum;

    const { motiPayHash, hashExpiry } = this.queryHash(
      'P',
      transactionNumber,
      transactionAmount,
    );

    return {
      transactionNumber: transactionNumber,
      motipayHashExpiry: hashExpiry,
      motipayHash: motiPayHash,
    };
  };

  generateUrl = (
    details: MotiPayDetailsDto,
    permitIds: number[],
    transactionIds: string[],
  ) => {
    // Construct the URL with the transaction details for the payment gateway
    const { queryString, motiPayHash } = this.queryHash(
      details.transactionType,
      details.transactionOrderNumber,
      `${details.transactionAmount}`,
      permitIds,
      transactionIds,
    );

    return {
      ...details,
      url:
        `${process.env.MOTIPAY_BASE_URL}?` +
        `${queryString}` +
        `&hashValue=${motiPayHash}`,
    };
  };

  /**
   * Generates a URL with transaction details for forwarding the user to the payment gateway.
   *
   * @param {number} transactionAmount - The amount of the transaction.
   * @returns {string} The URL containing transaction details for the payment gateway.
   */
  forwardTransactionDetails = (
    paymentMethodId: number,
    transactionSubmitDate: string,
    transactionAmount: number,
  ): MotiPayDetailsDto => {
    // Generate the hash and other necessary values for the transaction
    const hash = this.createHash(transactionAmount.toString());
    const transactionNumber = hash.transactionNumber;
    const transactionType = 'P';

    return {
      url: '',
      transactionOrderNumber: transactionNumber,
      transactionAmount: transactionAmount,
      transactionType: transactionType,
      transactionSubmitDate: transactionSubmitDate,
      paymentMethodId: paymentMethodId,
    };
  };

  /**
   * Updates a transaction in the system based on the provided data.
   *
   * @param {IUserJWT} currentUser - The current user making the update request (JWT user object).
   * @param {CreateTransactionDto} transaction - The data representing the updated transaction (CreateTransactionDto).
   * @returns {ReadTransactionDto} A promise that resolves to the updated transaction data (ReadTransactionDto).
   * @throws HttpException with status 500 if the transaction update fails.
   */
  async updateTransaction(
    currentUser: IUserJWT,
    transaction: CreateTransactionDto,
  ): Promise<ReadTransactionDto> {
    // Retrieve the existing transaction from the database based on the provided transaction order number.
    const existingTransaction = await this.findOneTransaction(
      transaction.transactionOrderNumber,
    );

    // Find the corresponding permit transaction for the existing transaction.
    const existingPermitTransaction = await this.findOnePermitTransaction(
      existingTransaction.transactionId,
    );

    // Map the updated transaction data (CreateTransactionDto) to a new Transaction object.
    const newTransaction = await this.classMapper.mapAsync(
      transaction,
      CreateTransactionDto,
      Transaction,
    );

    // If the updated transaction is approved, issue a permit using the application service.
    if (newTransaction.approved) {
      // Extract relevant transaction details for issuing the permit.
      const applicationId = existingPermitTransaction.permitId.toString();
      const transactionDetails: IReceipt = {
        transactionOrderNumber: newTransaction.transactionOrderNumber,
        transactionAmount: newTransaction.transactionAmount,
        transactionDate: newTransaction.transactionDate,
        paymentMethod: newTransaction.paymentMethod,
      };

      // Call the application service to issue the permit.
      await this.applicationService.issuePermit(
        currentUser,
        applicationId,
        transactionDetails,
      );
    }

    // Update the existing transaction record in the database with the new transaction data.
    const updatedTransaction = await this.transactionRepository.update(
      { transactionId: existingTransaction.transactionId },
      newTransaction,
    );

    // Check if the transaction update was successful, if not, throw an exception.
    if (!updatedTransaction.affected) {
      throw new HttpException('Error updating transaction', 500);
    }

    // Return the updated transaction data (ReadTransactionDto).
    return await this.classMapper.mapAsync(
      await this.transactionRepository.findOne({
        where: { transactionId: existingTransaction.transactionId },
      }),
      Transaction,
      ReadTransactionDto,
    );
  }

  /**
   * Creates new transactions and associates them with the provided permit IDs and payment details.
   * TODO: Should be one transaction with many permits?
   * @param permitIds - An array of permit IDs to associate with the new transactions.
   * @param paymentDetails - The payment details to be added to each new transaction.
   */
  async createTransaction(
    permitIds: number[],
    paymentDetails: MotiPayDetailsDto,
  ) {
    const permitTransactions: Pick<
      PermitTransaction,
      'permitId' | 'transactionId'
    >[] = [];

    // Loop through each permit ID to create a new transaction and associate it with the permit.
    for (const id of permitIds) {
      // Create a new transaction record in the transaction table with the provided payment details.
      await this.transactionRepository
        .createQueryBuilder()
        .insert()
        .values({
          //permits: [permit],
          transactionOrderNumber: paymentDetails.transactionOrderNumber,
          transactionAmount: paymentDetails.transactionAmount,
          transactionType: paymentDetails.transactionType,
          transactionSubmitDate: paymentDetails.transactionSubmitDate,
          paymentMethodId: paymentDetails.paymentMethodId,
        })
        .execute();

      // Retrieve the newly created transaction from the database based on the order number.
      // NOTE: this could potentially cause a problem in the future if multiple transactions have same order number
      // since we're using same paymentDetails.transactionOrderNumber for multiple permit ids
      const transaction = await this.findOneTransaction(
        paymentDetails.transactionOrderNumber,
      );

      // Prepare the data to associate the permit with the newly created transaction.
      const permitTransaction = {
        permitId: id,
        transactionId: transaction.transactionId,
      };

      // Save the association of the permit with the transaction in the permitTransaction table.
      await this.permitTransactionRepository.save(permitTransaction);

      permitTransactions.push(permitTransaction);
    }

    return permitTransactions;
  }

  async findOneTransaction(
    transactionOrderNumber: string,
  ): Promise<ReadTransactionDto> {
    return this.classMapper.mapAsync(
      await this.transactionRepository.findOne({
        where: {
          transactionOrderNumber: transactionOrderNumber,
        },
      }),
      Transaction,
      ReadTransactionDto,
    );
  }

  async findOnePermitTransaction(
    transactionId: string,
  ): Promise<ReadPermitTransactionDto> {
    return this.classMapper.mapAsync(
      await this.permitTransactionRepository.findOne({
        where: {
          transactionId: transactionId,
        },
      }),
      PermitTransaction,
      ReadPermitTransactionDto,
    );
  }
}
