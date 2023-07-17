import { HttpException, Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { IPayment } from '../../common/interface/payment.interface';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { ReadTransactionDto } from './dto/response/read-transaction.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PermitTransaction } from './entities/permit-transaction.entity';
import { ReadPermitTransactionDto } from './dto/response/read-permit-transaction.dto';
import { MotiPayDetailsDto } from './dto/response/read-moti-pay-details.dto';
import { ApplicationService } from '../permit/application.service';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { IReceipt } from 'src/common/interface/receipt.interface';
import { Receipt } from './entities/receipt.entity';
import { callDatabaseSequence } from 'src/common/helper/database.helper';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PermitTransaction)
    private permitTransactionRepository: Repository<PermitTransaction>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    // @InjectRepository(Receipt)
    // private receiptRepository: Repository<Receipt>,
    private dataSource: DataSource,
    @InjectMapper() private readonly classMapper: Mapper,
    private applicationService: ApplicationService,
  ) {}

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

    // Giving our hash expiry a value of current date plus 10 minutes which is sufficient
    const hashExpiryDt = new Date(currDate.getTime() + 10 * 60000);

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
    const hashExpiry = `${year}${monthPadded}${dayPadded}${hoursPadded}${minutesPadded}`;
    const motipayHashExpiry = hashExpiry;

    // There should be a better way of doing this which is not as rigid - something like
    // dynamically removing the hashValue param from the actual query string instead of building
    // it up manually below, but this is sufficient for now.
    const queryString = `merchant_id=${process.env.MOTIPAY_MERCHANT_ID}&trnType=P&trnOrderNumber=${transactionNumber}&trnAmount=${transactionAmount}&approvedPage=${process.env.MOTIPAY_REDIRECT}&declinedPage=${process.env.MOTIPAY_REDIRECT}${process.env.MOTIPAY_API_KEY}`;

    // Generate the hash using the query string and the MD5 algorithm
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const motiPayHash: string = CryptoJS.MD5(queryString).toString();

    return {
      transactionNumber: transactionNumber,
      motipayHashExpiry: motipayHashExpiry,
      motipayHash: motiPayHash,
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
    const motipayHash = hash.motipayHash;
    const transactionNumber = hash.transactionNumber;
    const transactionType = 'P';

    // Construct the URL with the transaction details for the payment gateway
    return {
      url: `${process.env.MOTIPAY_BASE_URL}?merchant_id=${process.env.MOTIPAY_MERCHANT_ID}&trnType=${transactionType}&trnOrderNumber=${transactionNumber}&trnAmount=${transactionAmount}&approvedPage=${process.env.MOTIPAY_REDIRECT}&declinedPage=${process.env.MOTIPAY_REDIRECT}&hashValue=${motipayHash}`,
      transactionOrderNumber: transactionNumber,
      transactionAmount: transactionAmount,
      transactionType: transactionType,
      transactionSubmitDate: transactionSubmitDate,
      paymentMethodId: paymentMethodId,
    };
  };

  async updateTransaction(
    currentUser: IUserJWT,
    transaction: CreateTransactionDto,
  ): Promise<ReadTransactionDto> {
    const existingTransaction = await this.findOneTransaction(
      transaction.transactionOrderNumber,
    );

    const existingPermitTransaction = await this.findOnePermitTransaction(
      existingTransaction.transactionId,
    );

    const newTransaction = this.classMapper.map(
      transaction,
      CreateTransactionDto,
      Transaction,
    );

    if (newTransaction.approved) {
      const applicationId = existingPermitTransaction.permitId.toString();
      const transactionDetails: IReceipt = {
        transactionOrderNumber: newTransaction.transactionOrderNumber,
        transactionAmount: newTransaction.transactionAmount,
        transactionDate: newTransaction.transactionDate,
        paymentMethod: newTransaction.paymentMethod,
      };

      await this.applicationService.issuePermit(
        currentUser,
        applicationId,
        transactionDetails,
      );
    }

    const updatedTransaction = await this.transactionRepository.update(
      { transactionId: existingTransaction.transactionId },
      newTransaction,
    );

    if (!updatedTransaction.affected) {
      throw new HttpException('Error updating transaction', 500);
    }

    return newTransaction;
  }

  async createTransaction(
    // accessToken: string,
    // companyId: number,
    permitIds: number[],
    paymentDetails: MotiPayDetailsDto,
  ) {
    for (const id of permitIds) {
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

      const transaction = await this.findOneTransaction(
        paymentDetails.transactionOrderNumber,
      );

      const permitTransaction = {
        permitId: id,
        transactionId: transaction.transactionId,
      };

      await this.permitTransactionRepository.save(permitTransaction);
    }

    // const permit: Permit = await lastValueFrom(
    //   this.httpService.get(
    //     `${process.env.VEHICLES_URL}/permits/applications/${permitId}?companyId=${companyId}`,
    //     {
    //       headers: { Authorization: accessToken },
    //     },
    //   ),
    // ).then((response) => {
    //   return response.data;
    // });
  }

  // async createReceipt(
  //   transactionOrderNumber: string,
  // ){

  //   const transaction = await this.findOneTransactionByOrderNumber(
  //     transactionOrderNumber,
  //   );

  //   //Generate receipt number for the permit to be created in database.
  //   const receiptNumber = await this.generateReceiptNumber(
  //     transaction.transactionId
  //   );

    
  //   await this.receiptRepository
  //       .createQueryBuilder()
  //       .insert()
  //       .values({
  //         receiptNumber: receiptNumber,
  //         transactionId: transaction.transactionId,
  //         receiptDocumentId: "111",
  //       })
  //       .execute();
  // }

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
    transactionId: number,
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

  // /**
  //  * Generate Receipt Number
  //  * @param applicationSource to get the source code
  //  * @param permitId if permit id is present then it is a permit amendment
  //  * and application number will be generated from exisitng permit number.
  //  */
  // async generateReceiptNumber(
  //   transactionId: number,
  // ): Promise<string> {
  //   let seq: string;
  //   let source;
  //   const currentDate = new Date();
  //   const year = currentDate.getFullYear();
  //   const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  //   const day = String(currentDate.getDate()).padStart(2, "0");
  //   const dateString = `${year}${month}${day}`;
  //   source = dateString;
  //   //New receipt.
  //   seq = await callDatabaseSequence(
  //     'permit.ORBC_RECEIPT_NUMBER_SEQ',
  //     this.dataSource,
  //   );
  //   const receiptNumber = String(
  //       String(source) +
  //       '-' +
  //       String(seq.padStart(8, '0')),
  //   );

  //   return receiptNumber;
  // }
}
