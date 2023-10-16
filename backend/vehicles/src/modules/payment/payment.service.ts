import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { CreateTransactionDto } from './dto/request/create-transaction.dto';
import { ReadTransactionDto } from './dto/response/read-transaction.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository, UpdateResult } from 'typeorm';
import { PermitTransaction } from './entities/permit-transaction.entity';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { callDatabaseSequence } from 'src/common/helper/database.helper';
import { Permit } from '../permit/entities/permit.entity';
import { ApplicationStatus } from '../../common/enum/application-status.enum';
import { PaymentMethodType } from '../../common/enum/payment-method-type.enum';
import { TransactionType } from '../../common/enum/transaction-type.enum';
import { UpdatePaymentGatewayTransactionDto } from './dto/request/read-payment-gateway-transaction.dto';
import { ReadPaymentGatewayTransactionDto } from './dto/response/read-payment-gateway-transaction.dto';
import { Receipt } from './entities/receipt.entity';
import { Directory } from 'src/common/enum/directory.enum';

@Injectable()
export class PaymentService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectMapper() private readonly classMapper: Mapper,
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

  private queryHash = (transaction: Transaction) => {
    const permitIds = transaction.permitTransactions.map(
      (permitTransaction) => {
        return permitTransaction.permit.permitId;
      },
    );

    // Construct the URL with the transaction details for the payment gateway
    const redirectUrl = permitIds
      ? `${process.env.PAYBC_REDIRECT}` +
        encodeURIComponent(
          `?permitIds=${permitIds.join(',')}&transactionId=${
            transaction.transactionId
          }`,
        )
      : `${process.env.PAYBC_REDIRECT}`;

      const date = new Date().toISOString().split('T')[0];

    // There should be a better way of doing this which is not as rigid - something like
    // dynamically removing the hashValue param from the actual query string instead of building
    // it up manually below, but this is sufficient for now.
    const queryString =
    `pbcRefNumber=${process.env.PAYBC_REF_NUMBER}` +
    `&description=DirectSale` +
    `&trnNumber=${transaction.transactionOrderNumber}` +
    `&trnAmount=${transaction.totalTransactionAmount}` +
    `&redirectUri=${redirectUrl}` +
    `&trnDate=${date}` +
    `&glDate=${date}` +
    `&paymentMethod=CC` +
    `&currency=CAD` +
    `&revenue=1:${process.env.glcode}:${transaction.totalTransactionAmount}`;

    // Generate the hash using the query string and the MD5 algorithm
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const payBCHash: string = CryptoJS.MD5(
      `${queryString}${process.env.PAYBC_API_KEY}`,
    ).toString();
    const hashExpiry = this.generateHashExpiry();

    return { queryString, payBCHash, hashExpiry };
  };

  generateUrl(transaction: Transaction): string {
    // Construct the URL with the transaction details for the payment gateway
    const { queryString, payBCHash } = this.queryHash(transaction);

    const url =
      `${process.env.PAYBC_BASE_URL}?` +
      `${queryString}` +
      `&hashValue=${payBCHash}`;
    return url;
  }

  /**
   * Generates a transaction Order Number for ORBC and for forwarding to the payment gateway.
   *
   * @returns {string} The Transaction Order Number.
   */
  async generateTransactionOrderNumber(): Promise<string> {
    const seq: number = parseInt(
      await callDatabaseSequence(
        'permit.ORBC_TRANSACTION_NUMBER_SEQ',
        this.dataSource,
      ),
    );
    const trnNum = seq.toString(16);
    // const trnNum = 'T' + currDate.getTime().toString().substring(4);
    const currentDate = Date.now();
    const transactionOrderNumber =
      'T' + trnNum.padStart(9, '0').toUpperCase() + String(currentDate);

    return transactionOrderNumber;
  }

  /**
   * Generate Receipt Number
   */
  async generateReceiptNumber(): Promise<string> {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    const source = dateString;
    const seq = await callDatabaseSequence(
      'permit.ORBC_RECEIPT_NUMBER_SEQ',
      this.dataSource,
    );
    const receiptNumber = String(String(source) + '-' + String(seq));

    return receiptNumber;
  }

  private isWebTransactionPurchase(
    paymentMethod: PaymentMethodType,
    transactionType: TransactionType,
  ) {
    return (
      paymentMethod == PaymentMethodType.WEB &&
      transactionType == TransactionType.PURCHASE
    );
  }

  private assertApplicationInProgress(
    paymentMethod: PaymentMethodType,
    transactionType: TransactionType,
    permitStatus: ApplicationStatus,
  ) {
    if (
      this.isWebTransactionPurchase(paymentMethod, transactionType) &&
      permitStatus != ApplicationStatus.IN_PROGRESS
    ) {
      throw new BadRequestException('Application should be in Progress!!');
    }
  }

  private isRefundOrZero(transactionType: TransactionType) {
    return (
      transactionType == TransactionType.REFUND ||
      transactionType == TransactionType.ZERO_AMOUNT
    );
  }

  /**
   * Creates a Transaction in ORBC System.
   * @param currentUser - The current user object of type {@link IUserJWT}
   * @param createTransactionDto - The createTransactionDto object of type
   *                                {@link CreateTransactionDto} for creating a new Transaction.
   * @returns {ReadTransactionDto} The created transaction of type {@link ReadTransactionDto}.
   */
  async createTransactions(
    currentUser: IUserJWT,
    createTransactionDto: CreateTransactionDto,
    directory: Directory,
    nestedQueryRunner?: QueryRunner,
  ): Promise<ReadTransactionDto> {
    const totalTransactionAmount =
      createTransactionDto.applicationDetails?.reduce(
        (accumulator, item) => accumulator + item.transactionAmount,
        0,
      );
    const transactionOrderNumber = await this.generateTransactionOrderNumber();
    let readTransactionDto: ReadTransactionDto;
    const queryRunner =
      nestedQueryRunner || this.dataSource.createQueryRunner();
    if (!nestedQueryRunner) {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }
    try {
      let newTransaction = await this.classMapper.mapAsync(
        createTransactionDto,
        CreateTransactionDto,
        Transaction,
        {
          extraArgs: () => ({
            transactionOrderNumber: transactionOrderNumber,
            totalTransactionAmount: totalTransactionAmount,
            userName: currentUser.userName,
            userGUID: currentUser.userGUID,
            timestamp: new Date(),
            directory: directory,
          }),
        },
      );

      newTransaction = await queryRunner.manager.save(newTransaction);

      for (const application of createTransactionDto.applicationDetails) {
        const existingApplication = await queryRunner.manager.findOne(Permit, {
          where: { permitId: application.applicationId },
        });

        this.assertApplicationInProgress(
          newTransaction.paymentMethodId,
          newTransaction.transactionTypeId,
          existingApplication.permitStatus,
        );

        let newPermitTransactions = new PermitTransaction();
        newPermitTransactions.transaction = newTransaction;
        newPermitTransactions.permit = existingApplication;
        newPermitTransactions.createdDateTime = new Date();
        newPermitTransactions.createdUser = currentUser.userName;
        newPermitTransactions.createdUserDirectory = directory;
        newPermitTransactions.createdUserGuid = currentUser.userGUID;
        newPermitTransactions.updatedDateTime = new Date();
        newPermitTransactions.updatedUser = currentUser.userName;
        newPermitTransactions.updatedUserDirectory = directory;
        newPermitTransactions.updatedUserGuid = currentUser.userGUID;
        newPermitTransactions.transactionAmount = application.transactionAmount;
        newPermitTransactions = await queryRunner.manager.save(
          newPermitTransactions,
        );

        if (
          this.isWebTransactionPurchase(
            newTransaction.paymentMethodId,
            newTransaction.transactionTypeId,
          )
        ) {
          existingApplication.permitStatus = ApplicationStatus.WAITING_PAYMENT;
          existingApplication.updatedDateTime = new Date();
          existingApplication.updatedUser = currentUser.userName;
          existingApplication.updatedUserDirectory = directory;
          existingApplication.updatedUserGuid = currentUser.userGUID;

          await queryRunner.manager.save(existingApplication);
        }
      }

      const createdTransaction = await queryRunner.manager.findOne(
        Transaction,
        {
          where: { transactionId: newTransaction.transactionId },
          relations: ['permitTransactions', 'permitTransactions.permit'],
        },
      );

      let url: string = undefined;
      if (
        this.isWebTransactionPurchase(
          createdTransaction.paymentMethodId,
          createdTransaction.transactionTypeId,
        )
      ) {
        url = this.generateUrl(createdTransaction);
      }

      if (this.isRefundOrZero(createdTransaction.transactionTypeId)) {
        const receiptNumber = await this.generateReceiptNumber();
        const receipt = new Receipt();
        receipt.receiptNumber = receiptNumber;
        receipt.transaction = createdTransaction;
        receipt.createdDateTime = new Date();
        receipt.createdUser = currentUser.userName;
        receipt.createdUserDirectory = directory;
        receipt.createdUserGuid = currentUser.userGUID;
        receipt.updatedDateTime = new Date();
        receipt.updatedUser = currentUser.userName;
        receipt.updatedUserDirectory = directory;
        receipt.updatedUserGuid = currentUser.userGUID;
        await queryRunner.manager.save(receipt);
      }

      readTransactionDto = await this.classMapper.mapAsync(
        createdTransaction,
        Transaction,
        ReadTransactionDto,
        {
          extraArgs: () => ({
            url: url,
          }),
        },
      );
      if (!nestedQueryRunner) {
        await queryRunner.commitTransaction();
      }
    } catch (err) {
      if (!nestedQueryRunner) {
        await queryRunner.rollbackTransaction();
      }
      throw new InternalServerErrorException(); // Should handle the typeorm Error handling
    } finally {
      if (!nestedQueryRunner) {
        await queryRunner.release();
      }
    }

    return readTransactionDto;
  }

  /**
   * Updates details returned by Payment Gateway in ORBC System.
   * @param currentUser - The current user object of type {@link IUserJWT}
   * @param updatePaymentGatewayTransactionDto - The UpdatePaymentGatewayTransactionDto object of type
   *                                {@link UpdatePaymentGatewayTransactionDto} for updating the payment gateway details.
   * @returns {ReadTransactionDto} The updated payment gateway of type {@link ReadPaymentGatewayTransactionDto}.
   */
  async updateTransactions(
    currentUser: IUserJWT,
    transactionId: string,
    updatePaymentGatewayTransactionDto: UpdatePaymentGatewayTransactionDto,
    directory: Directory,
  ): Promise<ReadPaymentGatewayTransactionDto> {
    let updatedTransaction: Transaction;
    let updateResult: UpdateResult;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const transactionToUpdate = await queryRunner.manager.findOne(
        Transaction,
        {
          where: { transactionId: transactionId },
          relations: ['permitTransactions', 'permitTransactions.permit'],
        },
      );

      if (!transactionToUpdate) {
        throw new NotFoundException('TransactionId not found');
      }

      transactionToUpdate.permitTransactions.forEach((permitTransaction) => {
        if (
          permitTransaction.permit.permitStatus !=
          ApplicationStatus.WAITING_PAYMENT
        ) {
          throw new BadRequestException(
            `${permitTransaction.permit.permitId} not in valid status!`,
          );
        }
      });

      const updateTransactionTemp = await this.classMapper.mapAsync(
        updatePaymentGatewayTransactionDto,
        UpdatePaymentGatewayTransactionDto,
        Transaction,
        {
          extraArgs: () => ({
            userName: currentUser.userName,
            userGUID: currentUser.userGUID,
            timestamp: new Date(),
            directory: directory,
          }),
        },
      );

      updateResult = await queryRunner.manager.update(
        Transaction,
        { transactionId: transactionId },
        updateTransactionTemp,
      );

      if (!updateResult?.affected) {
        throw new InternalServerErrorException('Error updating transaction');
      }

      if (updateTransactionTemp.pgApproved === 1) {
        for (const permitTransaction of transactionToUpdate.permitTransactions) {
          updateResult = await queryRunner.manager.update(
            Permit,
            { permitId: permitTransaction.permit.permitId },
            {
              permitStatus: ApplicationStatus.PAYMENT_COMPLETE,
              updatedDateTime: new Date(),
              updatedUser: currentUser.userName,
              updatedUserGuid: currentUser.userGUID,
              updatedUserDirectory: directory,
            },
          );
          if (!updateResult?.affected) {
            throw new InternalServerErrorException(
              'Error updating permit status',
            );
          }
        }
      }

      updatedTransaction = await queryRunner.manager.findOne(Transaction, {
        where: { transactionId: transactionId },
        relations: ['permitTransactions', 'permitTransactions.permit'],
      });

      if (updateTransactionTemp.pgApproved === 1) {
        const receiptNumber = await this.generateReceiptNumber();
        const receipt = new Receipt();
        receipt.receiptNumber = receiptNumber;
        receipt.transaction = updatedTransaction;
        receipt.receiptNumber = receiptNumber;
        receipt.createdDateTime = new Date();
        receipt.createdUser = currentUser.userName;
        receipt.createdUserDirectory = directory;
        receipt.createdUserGuid = currentUser.userGUID;
        receipt.updatedDateTime = new Date();
        receipt.updatedUser = currentUser.userName;
        receipt.updatedUserDirectory = directory;
        receipt.updatedUserGuid = currentUser.userGUID;
        await queryRunner.manager.save(receipt);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(); // Should handle the typeorm Error handling
    } finally {
      await queryRunner.release();
    }

    const readTransactionDto = await this.classMapper.mapAsync(
      updatedTransaction,
      Transaction,
      ReadPaymentGatewayTransactionDto,
    );

    return readTransactionDto;
  }

  async findTransaction(transactionId: string): Promise<ReadTransactionDto> {
    return this.classMapper.mapAsync(
      await this.findTransactionEntity(transactionId),
      Transaction,
      ReadTransactionDto,
    );
  }

  async findTransactionEntity(transactionId: string): Promise<Transaction> {
    return await this.transactionRepository.findOne({
      where: { transactionId: transactionId },
      relations: ['permitTransactions', 'permitTransactions.permit'],
    });
  }
}
