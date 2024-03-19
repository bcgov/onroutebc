import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
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
import { ApplicationStatus } from '../../../common/enum/application-status.enum';
import { PaymentMethodType as PaymentMethodTypeEnum } from '../../../common/enum/payment-method-type.enum';
import { TransactionType } from '../../../common/enum/transaction-type.enum';

import { ReadPaymentGatewayTransactionDto } from './dto/response/read-payment-gateway-transaction.dto';
import { Receipt } from './entities/receipt.entity';
import {
  PAYMENT_DESCRIPTION,
  PAYBC_PAYMENT_METHOD,
  PAYMENT_CURRENCY,
  CRYPTO_ALGORITHM_MD5,
} from '../../../common/constants/api.constant';
import { convertToHash } from 'src/common/helper/crypto.helper';
import { UpdatePaymentGatewayTransactionDto } from './dto/request/update-payment-gateway-transaction.dto';
import { PaymentCardType } from './entities/payment-card-type.entity';
import { PaymentMethodType } from './entities/payment-method-type.entity';
import { LogMethodExecution } from '../../../common/decorator/log-method-execution.decorator';
import { LogAsyncMethodExecution } from '../../../common/decorator/log-async-method-execution.decorator';
import { PermitHistoryDto } from '../permit/dto/response/permit-history.dto';
import {
  calculatePermitAmount,
  permitFee,
} from 'src/common/helper/permit-fee.helper';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(PaymentMethodType)
    private paymentMethodTypeRepository: Repository<PaymentMethodType>,
    @InjectRepository(PaymentCardType)
    private paymentCardTypeRepository: Repository<PaymentCardType>,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
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
    const redirectUrl = process.env.PAYBC_REDIRECT;
    const date = new Date().toISOString().split('T')[0];

    // There should be a better way of doing this which is not as rigid - something like
    // dynamically removing the hashValue param from the actual query string instead of building
    // it up manually below, but this is sufficient for now.
    const queryString =
      `pbcRefNumber=${process.env.PAYBC_REF_NUMBER}` +
      `&description=${PAYMENT_DESCRIPTION}` +
      `&trnNumber=${transaction.transactionOrderNumber}` +
      `&trnAmount=${transaction.totalTransactionAmount}` +
      `&redirectUri=${redirectUrl}` +
      `&trnDate=${date}` +
      `&glDate=${date}` +
      `&paymentMethod=${PAYBC_PAYMENT_METHOD}` +
      `&currency=${PAYMENT_CURRENCY}` +
      `&revenue=1:${process.env.GL_CODE}:${transaction.totalTransactionAmount}` +
      `&ref2=${transaction.transactionId}`;

    // Generate the hash using the query string and the MD5 algorithm
    const payBCHash: string = convertToHash(
      `${queryString}${process.env.PAYBC_API_KEY}`,
      CRYPTO_ALGORITHM_MD5,
    );

    const hashExpiry = this.generateHashExpiry();

    return { queryString, payBCHash, hashExpiry };
  };

  @LogMethodExecution()
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
  @LogAsyncMethodExecution()
  async generateTransactionOrderNumber(): Promise<string> {
    const seq: number = parseInt(
      await callDatabaseSequence(
        'permit.ORBC_TRANSACTION_NUMBER_SEQ',
        this.dataSource,
      ),
    );
    //Current epoch is 13 digit. using 2000000000000 in mod to result into 12 digit. will not generate duplicate value till year 2087. and will result into 8 character base36 string.
    //Using mod 35 with sequence number to get 35 unique values for each same timestamp mod evaluated earlier. decimal till digit 35 result into single base36 character.
    //Transaction number can not be more than 10 character hence the mod, to limit the character upto length of 10 character.
    //Done to minimize duplicate transaction number in dev and test.
    const trnNum =
      (Date.now() % 2000000000000).toString(36) + (seq % 35).toString(36);
    const transactionOrderNumber = 'T' + trnNum.padStart(9, '0').toUpperCase();

    return transactionOrderNumber;
  }

  /**
   * Generate Receipt Number
   */
  @LogAsyncMethodExecution()
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

  private isTransactionPurchase(transactionType: TransactionType) {
    return transactionType == TransactionType.PURCHASE;
  }

  private isWebTransactionPurchase(
    paymentMethod: PaymentMethodTypeEnum,
    transactionType: TransactionType,
  ) {
    return (
      paymentMethod == PaymentMethodTypeEnum.WEB &&
      this.isTransactionPurchase(transactionType)
    );
  }

  private assertApplicationInProgress(
    transactionType: TransactionType,
    permitStatus: ApplicationStatus,
  ) {
    if (
      this.isTransactionPurchase(transactionType) &&
      permitStatus != ApplicationStatus.IN_PROGRESS &&
      permitStatus != ApplicationStatus.WAITING_PAYMENT
    ) {
      throw new BadRequestException('Application should be in Progress!!');
    }
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
    nestedQueryRunner?: QueryRunner,
    voidStatus?: ApplicationStatus.VOIDED | ApplicationStatus.REVOKED,
  ): Promise<ReadTransactionDto> {
    let totalTransactionAmountCalculated: number = 0;
    // Calculate and add amount for each requested application, as per the available backend data.
    for (const application of createTransactionDto.applicationDetails) {
      totalTransactionAmountCalculated =
        totalTransactionAmountCalculated +
        (await this.permitFeeCalculator(
          application.applicationId,
          voidStatus,
          nestedQueryRunner,
        ));
    }
    const totalTransactionAmount =
      createTransactionDto.applicationDetails?.reduce(
        (accumulator, item) => accumulator + item.transactionAmount,
        0,
      );
    if (
      totalTransactionAmount.toFixed(2) !=
      Math.abs(totalTransactionAmountCalculated).toFixed(2)
    ) {
      throw new BadRequestException('Transaction Amount Mismatch');
    }

    //For transaction type refund, total transaction amount in backend should be less than zero and vice a versa.
    //This extra check to compare transaction type and amount is only needed in case of refund, for other trasaction types, comparing amount is sufficient.
    if (
      totalTransactionAmountCalculated < 0 &&
      createTransactionDto.transactionTypeId != TransactionType.REFUND
    ) {
      throw new BadRequestException('Transaction Type Mismatch');
    }
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
            directory: currentUser.orbcUserDirectory,
          }),
        },
      );

      newTransaction = await queryRunner.manager.save(newTransaction);

      for (const application of createTransactionDto.applicationDetails) {
        const existingApplication = await queryRunner.manager.findOne(Permit, {
          where: { permitId: application.applicationId },
        });
        if (!voidStatus)
          this.assertApplicationInProgress(
            newTransaction.transactionTypeId,
            existingApplication.permitStatus,
          );

        let newPermitTransactions = new PermitTransaction();
        newPermitTransactions.transaction = newTransaction;
        newPermitTransactions.permit = existingApplication;
        newPermitTransactions.createdDateTime = new Date();
        newPermitTransactions.createdUser = currentUser.userName;
        newPermitTransactions.createdUserDirectory =
          currentUser.orbcUserDirectory;
        newPermitTransactions.createdUserGuid = currentUser.userGUID;
        newPermitTransactions.updatedDateTime = new Date();
        newPermitTransactions.updatedUser = currentUser.userName;
        newPermitTransactions.updatedUserDirectory =
          currentUser.orbcUserDirectory;
        newPermitTransactions.updatedUserGuid = currentUser.userGUID;
        newPermitTransactions.transactionAmount = application.transactionAmount;
        newPermitTransactions = await queryRunner.manager.save(
          newPermitTransactions,
        );

        if (
          this.isWebTransactionPurchase(
            newTransaction.paymentMethodTypeCode,
            newTransaction.transactionTypeId,
          )
        ) {
          existingApplication.permitStatus = ApplicationStatus.WAITING_PAYMENT;
          existingApplication.updatedDateTime = new Date();
          existingApplication.updatedUser = currentUser.userName;
          existingApplication.updatedUserDirectory =
            currentUser.orbcUserDirectory;
          existingApplication.updatedUserGuid = currentUser.userGUID;

          await queryRunner.manager.save(existingApplication);
        } else if (
          this.isTransactionPurchase(newTransaction.transactionTypeId) &&
          !voidStatus
        ) {
          existingApplication.permitStatus = ApplicationStatus.PAYMENT_COMPLETE;
          existingApplication.updatedDateTime = new Date();
          existingApplication.updatedUser = currentUser.userName;
          existingApplication.updatedUserDirectory =
            currentUser.orbcUserDirectory;
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
          createdTransaction.paymentMethodTypeCode,
          createdTransaction.transactionTypeId,
        )
      ) {
        // Only payment using PayBC should generate the url
        url = this.generateUrl(createdTransaction);
      }

      if (
        !this.isWebTransactionPurchase(
          createdTransaction.paymentMethodTypeCode,
          createdTransaction.transactionTypeId,
        )
      ) {
        const receiptNumber = await this.generateReceiptNumber();
        const receipt = new Receipt();
        receipt.receiptNumber = receiptNumber;
        receipt.transaction = createdTransaction;
        receipt.createdDateTime = new Date();
        receipt.createdUser = currentUser.userName;
        receipt.createdUserDirectory = currentUser.orbcUserDirectory;
        receipt.createdUserGuid = currentUser.userGUID;
        receipt.updatedDateTime = new Date();
        receipt.updatedUser = currentUser.userName;
        receipt.updatedUserDirectory = currentUser.orbcUserDirectory;
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
    } catch (error) {
      if (!nestedQueryRunner) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(error);
      throw error;
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
    queryString: string,
  ): Promise<ReadPaymentGatewayTransactionDto> {
    let query: string, hashValue: string;
    //Code QL fixes.
    if (typeof queryString === 'string') {
      query = queryString
        .substring(0, queryString.indexOf('hashValue=') - 1)
        .replace('+', ' ');

      hashValue = queryString.substring(
        queryString.indexOf('hashValue=') + 10,
        queryString.length,
      );
    }

    const validHash =
      convertToHash(
        `${query}${process.env.PAYBC_API_KEY}`,
        CRYPTO_ALGORITHM_MD5,
      ) === hashValue;
    const validDto = this.validateUpdateTransactionDto(
      updatePaymentGatewayTransactionDto,
      `${query}&hashValue=${hashValue}`,
    );

    if (!validHash) {
      throw new InternalServerErrorException('Invalid Hash');
    }
    if (!validDto) {
      throw new InternalServerErrorException('Invalid Transaction Data');
    }
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
            directory: currentUser.orbcUserDirectory,
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
              updatedUserDirectory: currentUser.orbcUserDirectory,
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
        receipt.createdUserDirectory = currentUser.orbcUserDirectory;
        receipt.createdUserGuid = currentUser.userGUID;
        receipt.updatedDateTime = new Date();
        receipt.updatedUser = currentUser.userName;
        receipt.updatedUserDirectory = currentUser.orbcUserDirectory;
        receipt.updatedUserGuid = currentUser.userGUID;
        await queryRunner.manager.save(receipt);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
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

  validateUpdateTransactionDto(
    updatePaymentGatewayTransactionDto: UpdatePaymentGatewayTransactionDto,
    queryString: string,
  ): boolean {
    const params = new URLSearchParams(queryString);
    const trnApproved = updatePaymentGatewayTransactionDto.pgApproved;
    const messageText = updatePaymentGatewayTransactionDto.pgMessageText;
    const trnOrderId = updatePaymentGatewayTransactionDto.pgTransactionId;
    const trnAmount = params.get('trnAmount');
    const paymentMethod = updatePaymentGatewayTransactionDto.pgPaymentMethod;
    const cardType = updatePaymentGatewayTransactionDto.pgCardType ?? '';
    const authCode = updatePaymentGatewayTransactionDto.pgAuthCode;
    const trnDate = params.get('trnDate');
    const ref2 = params.get('ref2');
    const pbcTxnNumber = params.get('pbcTxnNumber');
    const hashValue = params.get('hashValue');
    const query =
      `trnApproved=${trnApproved}` +
      `&messageText=${messageText}` +
      `&trnOrderId=${trnOrderId}` +
      `&trnAmount=${trnAmount}` +
      `&paymentMethod=${paymentMethod}` +
      `&cardType=${cardType}` +
      `&authCode=${authCode}` +
      `&trnDate=${trnDate}` +
      `&ref2=${ref2}` +
      `&pbcTxnNumber=${pbcTxnNumber}`;
    return (
      convertToHash(
        `${query}${process.env.PAYBC_API_KEY}`,
        CRYPTO_ALGORITHM_MD5,
      ) === hashValue
    );
  }

  async findAllPaymentMethodTypeEntities(): Promise<PaymentMethodType[]> {
    return await this.paymentMethodTypeRepository.find();
  }

  async findAllPaymentCardTypeEntities(): Promise<PaymentCardType[]> {
    return await this.paymentCardTypeRepository.find();
  }

  /**
   * Calculates the permit fee based on the transaction type, permit ID, void status, and optional query runner.
   * @param transactionType The type of transaction.
   * @param permitId The ID of the permit.
   * @param voidStatus The void status of the application (optional).
   * @param nestedQueryRunner The nested query runner (optional).
   * @returns The calculated permit fee.
   */
  @LogAsyncMethodExecution()
  async permitFeeCalculator(
    permitId: string,
    voidStatus?: ApplicationStatus.VOIDED | ApplicationStatus.REVOKED,
    nestedQueryRunner?: QueryRunner,
  ): Promise<number> {
    if (voidStatus === ApplicationStatus.REVOKED) return 0;
    const application = await this.findOne(permitId, nestedQueryRunner);
    const permitPaymentHistory = await this.findPermitHistory(
      application.originalPermitId,
      nestedQueryRunner,
    );

    if (voidStatus === ApplicationStatus.VOIDED) {
      const oldAmount = calculatePermitAmount(permitPaymentHistory);
      if (oldAmount > 0) return -oldAmount;
      return oldAmount;
    }
    const oldAmount = calculatePermitAmount(permitPaymentHistory);
    return permitFee(application, oldAmount);
  }

  /**
   * Finds a single permit by ID.
   * @param permitId The ID of the permit to find.
   * @returns A Promise resolving to the found Permit object.
   */
  private async findOne(
    permitId: string,
    nestedQueryRunner?: QueryRunner,
  ): Promise<Permit> {
    if (nestedQueryRunner) {
      return nestedQueryRunner.manager.findOne(Permit, {
        where: { permitId },
        relations: {
          company: true,
          permitData: true,
          applicationOwner: { userContact: true },
          issuer: { userContact: true },
        },
      });
    }
    const queryBuilder = this.permitRepository
      .createQueryBuilder('permit')
      .where('permit.permitId = :permitId', { permitId })
      .leftJoinAndSelect('permit.company', 'company')
      .leftJoinAndSelect('permit.permitData', 'permitData')
      .leftJoinAndSelect('permit.applicationOwner', 'applicationOwner')
      .leftJoinAndSelect('permit.issuer', 'issuer')
      .leftJoinAndSelect(
        'applicationOwner.userContact',
        'applicationOwnerUserContact',
      )
      .leftJoinAndSelect('issuer.userContact', 'issuerUserContact');
    return queryBuilder.getOne();
  }

  /**
   * Finds permit history based on the original permit ID.
   * @param originalPermitId The original permit ID to search for.
   * @param nestedQueryRunner The nested query runner (optional).
   * @returns A Promise resolving to an array of PermitHistoryDto objects.
   */
  @LogAsyncMethodExecution()
  async findPermitHistory(
    originalPermitId: string,
    nestedQueryRunner?: QueryRunner,
  ): Promise<PermitHistoryDto[]> {
    let permits: Permit[];
    if (nestedQueryRunner) {
      permits = await nestedQueryRunner.manager
        .createQueryBuilder()
        .select('permit')
        .from(Permit, 'permit')
        .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
        .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
        .where('permit.permitNumber IS NOT NULL')
        .andWhere('permit.originalPermitId = :originalPermitId', {
          originalPermitId: originalPermitId,
        })
        .orderBy('transaction.transactionSubmitDate', 'DESC')
        .getMany();
    } else {
      const queryBuilder = this.permitRepository
        .createQueryBuilder('permit')
        .innerJoinAndSelect('permit.permitTransactions', 'permitTransactions')
        .innerJoinAndSelect('permitTransactions.transaction', 'transaction')
        .where('permit.permitNumber IS NOT NULL')
        .andWhere('permit.originalPermitId = :originalPermitId', {
          originalPermitId,
        })
        .orderBy('transaction.transactionSubmitDate', 'DESC');
      permits = await queryBuilder.getMany();
    }

    return permits.flatMap((permit) =>
      permit.permitTransactions.map((permitTransaction) => ({
        permitNumber: permit.permitNumber,
        comment: permit.comment,
        transactionOrderNumber:
          permitTransaction.transaction.transactionOrderNumber,
        transactionAmount: permitTransaction.transactionAmount,
        transactionTypeId: permitTransaction.transaction.transactionTypeId,
        pgPaymentMethod: permitTransaction.transaction.pgPaymentMethod,
        pgTransactionId: permitTransaction.transaction.pgTransactionId,
        paymentCardTypeCode: permitTransaction.transaction.paymentCardTypeCode,
        paymentMethodTypeCode:
          permitTransaction.transaction.paymentMethodTypeCode,
        commentUsername: permit.createdUser,
        permitId: +permit.permitId,
        transactionSubmitDate:
          permitTransaction.transaction.transactionSubmitDate,
        pgApproved: permitTransaction.transaction.pgApproved,
      })),
    ) as PermitHistoryDto[];
  }
}
