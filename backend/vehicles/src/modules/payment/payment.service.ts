import {
  BadRequestException,
  Inject,
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
import {
  PaymentMethodType as PaymentMethodTypeEnum,
  PaymentMethodTypeReport,
} from '../../common/enum/payment-method-type.enum';
import { TransactionType } from '../../common/enum/transaction-type.enum';

import { ReadPaymentGatewayTransactionDto } from './dto/response/read-payment-gateway-transaction.dto';
import { Receipt } from './entities/receipt.entity';
import { Directory } from 'src/common/enum/directory.enum';
import { Response } from 'express';
import { CreatePaymentDetailedReportDto } from './dto/request/create-payment-detailed-report.dto';
import { DopsService } from '../common/dops.service';
import { DopsGeneratedReport } from '../../common/interface/dops-generated-report.interface';
import { ReportTemplate } from '../../common/enum/report-template.enum';
import { convertUtcToPt } from '../../common/helper/date-time.helper';
import {
  PAYMENT_DESCRIPTION,
  PAYBC_PAYMENT_METHOD,
  PAYMENT_CURRENCY,
} from '../../common/constants/vehicles.constant';
import { validateHash } from 'src/common/helper/validateHash.helper';
import { UpdatePaymentGatewayTransactionDto } from './dto/request/update-payment-gateway-transaction.dto';
import { PaymentCardType } from './entities/payment-card-type.entity';
import { PaymentMethodType } from './entities/payment-method-type.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKey } from '../../common/enum/cache-key.enum';
import { getFromCache } from '../../common/helper/cache.helper';
import { IPaymentCode } from '../../common/interface/payment-code.interface';
import { PermitTypeReport } from '../../common/enum/permit-type.enum';
import { IPaymentReportDataDetails } from '../../common/interface/payment-report-data-details.interface';
import { IPaymentReportData } from '../../common/interface/payment-report-data.interface';
import { PermitType } from '../permit/entities/permit-type.entity';
import { CreatePaymentSummaryReportDto } from './dto/request/create-payment-summary-report.dto';

@Injectable()
export class PaymentService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(PaymentMethodType)
    private paymentMethodTypeRepository: Repository<PaymentMethodType>,
    @InjectRepository(PaymentCardType)
    private paymentCardTypeRepository: Repository<PaymentCardType>,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly dopsService: DopsService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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
      ? `${process.env.PAYBC_REDIRECT}` + `?path=${permitIds.join(',')}`
      : `${process.env.PAYBC_REDIRECT}`;

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
    paymentMethod: PaymentMethodTypeEnum,
    transactionType: TransactionType,
  ) {
    return (
      paymentMethod == PaymentMethodTypeEnum.WEB &&
      transactionType == TransactionType.PURCHASE
    );
  }

  private assertApplicationInProgress(
    paymentMethod: PaymentMethodTypeEnum,
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
          newTransaction.paymentMethodTypeCode,
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
            newTransaction.paymentMethodTypeCode,
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
          createdTransaction.paymentMethodTypeCode,
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
    queryString: string,
  ): Promise<ReadPaymentGatewayTransactionDto> {
    const query = queryString.substring(
      0,
      queryString.indexOf('hashValue=') - 1,
    );
    const hashValue = queryString.substring(
      queryString.indexOf('hashValue=') + 10,
      queryString.length,
    );
    const validHash = validateHash(query, hashValue);
    const validDto = this.validateUpdateTransactionDto(
      updatePaymentGatewayTransactionDto,
      queryString,
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

  async findTransactionDataForReports(
    transactionType: TransactionType,
    paymentCode: IPaymentCode,
    permitTypes: PermitTypeReport[],
    createPaymentDetailedReportDto: CreatePaymentDetailedReportDto,
  ): Promise<IPaymentReportData> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('trans');

    queryBuilder
      .select('permit.permitIssueDateTime', 'issuedOn')
      .addSelect('trans.transactionOrderNumber', 'orbcTransactionId')
      .addSelect('trans.pgTransactionId', 'providerTransactionId')
      .addSelect('trans.paymentMethodTypeCode', 'paymentMethod')
      .addSelect('receipt.receiptNumber', 'receiptNo')
      .addSelect('permit.permitNumber', 'permitNo')
      .addSelect('permit.permitType', 'permitType')
      .addSelect('permitTransactions.transactionAmount', 'amount');

    queryBuilder
      .innerJoin('trans.permitTransactions', 'permitTransactions')
      .innerJoin('trans.receipt', 'receipt')
      .innerJoin('permitTransactions.permit', 'permit');

    queryBuilder.where('trans.transactionTypeId = :transactionType', {
      transactionType: transactionType,
    });

    queryBuilder.andWhere('permit.permitStatus = :permitStatus', {
      permitStatus: ApplicationStatus.ISSUED,
    });

    queryBuilder.andWhere('permit.permitIssueDateTime >= :fromDateTime', {
      fromDateTime: createPaymentDetailedReportDto.fromDateTime,
    });
    queryBuilder.andWhere('permit.permitIssueDateTime < :toDateTime', {
      toDateTime: createPaymentDetailedReportDto.toDateTime,
    });

    queryBuilder.andWhere(
      'trans.paymentMethodTypeCode = :paymentMethodTypeCode',
      { paymentMethodTypeCode: paymentCode.paymentMethodTypeCode },
    );
    if (paymentCode.paymentCardTypeCode) {
      queryBuilder.andWhere(
        'trans.paymentCardTypeCode = :paymentCardTypeCode',
        { paymentCardTypeCode: paymentCode.paymentCardTypeCode },
      );
    }

    if (createPaymentDetailedReportDto.issuedBy?.length) {
      queryBuilder.andWhere('permit.permitIssuedBy IN (:...issuedBy)', {
        issuedBy: createPaymentDetailedReportDto.issuedBy,
      });
    }

    if (permitTypes?.length) {
      queryBuilder.andWhere('permit.permitType IN (:...permitTypes)', {
        permitTypes: Object.values(permitTypes).filter(
          (x) => x != PermitTypeReport.ALL,
        ),
      });
    }

    if (createPaymentDetailedReportDto.users?.length) {
      queryBuilder.andWhere('permit.issuerUserGuid IN (:...issuerUserGuids)', {
        issuerUserGuids: createPaymentDetailedReportDto.users,
      });
    }

    queryBuilder.orderBy('permit.permitIssueDateTime');

    const paymentReportDataCollection: IPaymentReportDataDetails[] =
      await queryBuilder.getRawMany();

    let subtotal = 0;

    if (paymentReportDataCollection?.length) {
      const transformedPaymentReportDataCollection =
        paymentReportDataCollection.map((paymentReportData) => {
          subtotal += paymentReportData.amount;
          return {
            ...paymentReportData,
            paymentMethod: paymentCode.consolidatedPaymentMethod,
            issuedOn: convertUtcToPt(
              paymentReportData.issuedOn,
              'MMM. D, YYYY, hh:mm A Z',
            ),
          };
        });

      const paymentReportData: IPaymentReportData = {
        paymentReportData: transformedPaymentReportDataCollection,
        totalAmount: subtotal,
        paymentMethod: paymentCode.consolidatedPaymentMethod,
      };

      return paymentReportData;
    }
  }

  async findSummaryPermitDataForReports(
    paymentCode: IPaymentCode,
    permitTypes: PermitTypeReport[],
    createPaymentDetailedReportDto: CreatePaymentDetailedReportDto,
  ) {
    const queryBuilder = this.transactionRepository.createQueryBuilder('trans');

    queryBuilder
      .select('permit.permitType', 'permitType')
      .addSelect('COUNT(permit.permitType)', 'permitCount');

    queryBuilder
      .innerJoin('trans.permitTransactions', 'permitTransactions')
      .innerJoin('trans.receipt', 'receipt')
      .innerJoin('permitTransactions.permit', 'permit');

    queryBuilder.andWhere('permit.permitStatus = :permitStatus', {
      permitStatus: ApplicationStatus.ISSUED,
    });

    queryBuilder.andWhere('permit.permitIssueDateTime >= :fromDateTime', {
      fromDateTime: createPaymentDetailedReportDto.fromDateTime,
    });
    queryBuilder.andWhere('permit.permitIssueDateTime < :toDateTime', {
      toDateTime: createPaymentDetailedReportDto.toDateTime,
    });

    queryBuilder.andWhere(
      'trans.paymentMethodTypeCode = :paymentMethodTypeCode',
      { paymentMethodTypeCode: paymentCode.paymentMethodTypeCode },
    );
    if (paymentCode.paymentCardTypeCode) {
      queryBuilder.andWhere(
        'trans.paymentCardTypeCode = :paymentCardTypeCode',
        { paymentCardTypeCode: paymentCode.paymentCardTypeCode },
      );
    }

    if (createPaymentDetailedReportDto.issuedBy?.length) {
      queryBuilder.andWhere('permit.permitIssuedBy IN (:...issuedBy)', {
        issuedBy: createPaymentDetailedReportDto.issuedBy,
      });
    }

    if (permitTypes?.length) {
      queryBuilder.andWhere('permit.permitType IN (:...permitTypes)', {
        permitTypes: Object.values(permitTypes).filter(
          (x) => x != PermitTypeReport.ALL,
        ),
      });
    }

    if (createPaymentDetailedReportDto.users?.length) {
      queryBuilder.andWhere('permit.issuerUserGuid IN (:...issuerUserGuids)', {
        issuerUserGuids: createPaymentDetailedReportDto.users,
      });
    }
    queryBuilder.groupBy('permit.permitType');
    queryBuilder.orderBy('permit.permitType');

    const permitSummaryDetails = (await queryBuilder.getRawMany()) as [
      { permitType: PermitType; permitCount: number },
    ];

    if (permitSummaryDetails?.length) {
      return permitSummaryDetails;
    }
  }

  private async formatPermitSummaryForDopsInput(
    paymentCodes: IPaymentCode[],
    permitTypes: PermitTypeReport[],
    createPaymentDetailedReportDto: CreatePaymentDetailedReportDto,
  ) {
    const summaryPermitDetailsFromDB = await Promise.all(
      paymentCodes.map(async (paymentCode: IPaymentCode) => {
        return await this.findSummaryPermitDataForReports(
          paymentCode,
          permitTypes,
          createPaymentDetailedReportDto,
        );
      }),
    );

    const result = summaryPermitDetailsFromDB
      .flat()
      .filter((x) => x != undefined)
      .reduce((acc, { permitType, permitCount }) => {
        const key = permitType as unknown as string;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-plus-operands
        acc[key] = (acc[key] || 0) + permitCount;
        return acc;
      }, {});

    const summaryPermitSubTotal = Object.entries(result).map(
      ([permitType, permitCount]) => ({ permitType, permitCount }),
    ) as [{ permitType: PermitTypeReport; permitCount: number }];

    const totalPermits = summaryPermitSubTotal.reduce(
      (acc, { permitType, permitCount }) => acc + permitCount,
      0,
    );

    const formatSummaryPermitDopsInput = [];
    formatSummaryPermitDopsInput.push(...summaryPermitSubTotal);
    formatSummaryPermitDopsInput.push({ totalPermits: totalPermits });

    return formatSummaryPermitDopsInput as unknown;
  }

  private formatPaymentSummaryForDopsInput(
    paymentCodes: IPaymentCode[],
    purchasePaymentMethodAmountMap: Map<string, number>,
    refundPaymentMethodAmountMap: Map<string, number>,
  ) {
    const formatSummaryPaymentDopsInput = [];
    let subTotalPaymentAmount = 0;
    let subTotalRefundAmount = 0;
    let subTotalDepositAmount = 0;
    for (const paymentCode of paymentCodes) {
      if (
        purchasePaymentMethodAmountMap.has(
          paymentCode.consolidatedPaymentMethod,
        ) ||
        refundPaymentMethodAmountMap.has(paymentCode.consolidatedPaymentMethod)
      ) {
        let paymentAmount: number = purchasePaymentMethodAmountMap.get(
          paymentCode.consolidatedPaymentMethod,
        );
        paymentAmount = paymentAmount || 0;
        subTotalPaymentAmount += paymentAmount;
        let refundAmount: number = refundPaymentMethodAmountMap.get(
          paymentCode.consolidatedPaymentMethod,
        );
        refundAmount = refundAmount || 0;
        subTotalRefundAmount += refundAmount;
        const deposit: number = paymentAmount - refundAmount;
        subTotalDepositAmount += deposit;
        formatSummaryPaymentDopsInput.push({
          paymentMethod: paymentCode.consolidatedPaymentMethod,
          payment: paymentAmount,
          refund: refundAmount,
          deposit: deposit,
        });
      }
    }

    formatSummaryPaymentDopsInput.push({
      subTotalPaymentAmount: subTotalPaymentAmount,
      subTotalRefundAmount: subTotalRefundAmount,
      subTotalDepositAmount: subTotalDepositAmount,
    });
    formatSummaryPaymentDopsInput.push({
      grandTotalAmount: subTotalDepositAmount,
    });
    return formatSummaryPaymentDopsInput as unknown;
  }

  private async getTransactionDetailsFromDb(
    transactionType: TransactionType,
    paymentCodes: IPaymentCode[],
    permitTypes: PermitTypeReport[],
    createPaymentDetailedReportDto: CreatePaymentDetailedReportDto,
    refundPaymentMethodAmountMap: Map<string, number>,
  ): Promise<IPaymentReportData[]> {
    return await Promise.all(
      paymentCodes.map(async (paymentCode: IPaymentCode) => {
        const paymentReportData: IPaymentReportData =
          await this.findTransactionDataForReports(
            transactionType,
            paymentCode,
            permitTypes,
            createPaymentDetailedReportDto,
          );

        if (paymentReportData) {
          refundPaymentMethodAmountMap.set(
            paymentReportData?.paymentMethod,
            paymentReportData?.totalAmount,
          );

          return paymentReportData;
        }
      }),
    );
  }

  private formatTransactionDataForDopsInput(
    paymentDetails: IPaymentReportData[],
  ) {
    let grandTotalAmount = 0;
    const formatPaymentDopsInput = [];
    if (paymentDetails?.some((element) => element !== undefined)) {
      paymentDetails.forEach((paymentReportData) => {
        if (paymentReportData) {
          formatPaymentDopsInput.push(...paymentReportData.paymentReportData);
          formatPaymentDopsInput.push({
            paymentMethod: paymentReportData.paymentMethod,
            subTotalAmount: paymentReportData.totalAmount,
          });

          grandTotalAmount += paymentReportData.totalAmount;
        }
      });

      formatPaymentDopsInput.push({ totalAmount: grandTotalAmount });
    }
    return formatPaymentDopsInput as unknown;
  }

  private async getConsolidatedPaymentMethodFromDto(
    createPaymentDetailedReportDto: CreatePaymentDetailedReportDto,
  ) {
    const paymentCodes: IPaymentCode[] = [];
    for (const paymentCode of createPaymentDetailedReportDto.paymentCodes) {
      const paymentCodeTemp: IPaymentCode = {
        paymentMethodTypeCode: paymentCode.paymentMethodTypeCode,
        paymentCardTypeCode: paymentCode.paymentCardTypeCode,
        consolidatedPaymentMethod:
          (await getFromCache(
            this.cacheManager,
            CacheKey.PAYMENT_METHOD_TYPE,
            paymentCode.paymentMethodTypeCode,
          )) +
          ' - ' +
          (await getFromCache(
            this.cacheManager,
            CacheKey.PAYMENT_CARD_TYPE,
            paymentCode.paymentCardTypeCode,
          )),
      };

      paymentCodes.push(paymentCodeTemp);
    }

    paymentCodes.sort((a, b) =>
      a.consolidatedPaymentMethod.localeCompare(b.consolidatedPaymentMethod),
    );
    return paymentCodes;
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
    const cardType = updatePaymentGatewayTransactionDto.pgCardType;
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
    return validateHash(query, hashValue);
  }

  async findAllPaymentMethodTypeEntities(): Promise<PaymentMethodType[]> {
    return await this.paymentMethodTypeRepository.find();
  }

  async findAllPaymentCardTypeEntities(): Promise<PaymentCardType[]> {
    return await this.paymentCardTypeRepository.find();
  }

  async createPaymentDetailedReport(
    currentUser: IUserJWT,
    createPaymentDetailedReportDto: CreatePaymentDetailedReportDto,
    res: Response,
  ): Promise<void> {
    const paymentCodes: IPaymentCode[] =
      await this.getConsolidatedPaymentMethodFromDto(
        createPaymentDetailedReportDto,
      );

    const permitTypes: PermitTypeReport[] =
      createPaymentDetailedReportDto.permitType;

    permitTypes.sort((a, b) => a.valueOf().localeCompare(b.valueOf()));

    const formatSummaryPermitDopsInput =
      await this.formatPermitSummaryForDopsInput(
        paymentCodes,
        permitTypes,
        createPaymentDetailedReportDto,
      );

    const purchasePaymentMethodAmountMap = new Map<string, number>();

    const purchasePaymentDetails: IPaymentReportData[] =
      await this.getTransactionDetailsFromDb(
        TransactionType.PURCHASE,
        paymentCodes,
        permitTypes,
        createPaymentDetailedReportDto,
        purchasePaymentMethodAmountMap,
      );

    const paymentDopsInput = this.formatTransactionDataForDopsInput(
      purchasePaymentDetails,
    );

    const refundPaymentMethodAmountMap = new Map<string, number>();

    const refundDetails: IPaymentReportData[] =
      await this.getTransactionDetailsFromDb(
        TransactionType.REFUND,
        paymentCodes,
        permitTypes,
        createPaymentDetailedReportDto,
        refundPaymentMethodAmountMap,
      );

    const refundDopsInput =
      this.formatTransactionDataForDopsInput(refundDetails);

    const formatSummaryPaymentDopsInput = this.formatPaymentSummaryForDopsInput(
      paymentCodes,
      purchasePaymentMethodAmountMap,
      refundPaymentMethodAmountMap,
    );

    const generateReportData: DopsGeneratedReport = {
      reportTemplate: ReportTemplate.PAYMENT_AND_REFUND_DETAILED_REPORT,
      reportData: {
        issuedBy: createPaymentDetailedReportDto.issuedBy.join(', '),
        runDate: convertUtcToPt(new Date(), 'MMM. D, YYYY, hh:mm A Z'),
        permitType: permitTypes.some(
          (permitType) => permitType === PermitTypeReport.ALL,
        )
          ? 'All Permit Types'
          : permitTypes.join(', '),
        paymentMethod: paymentCodes.some(
          (paymentCode) =>
            paymentCode.paymentMethodTypeCode === PaymentMethodTypeReport.ALL,
        )
          ? 'All Payment Methods'
          : paymentCodes
              .map((code) => code.consolidatedPaymentMethod)
              .join(', '),
        timePeriod: `${convertUtcToPt(
          createPaymentDetailedReportDto.fromDateTime,
          'MMM. D, YYYY, hh:mm A Z',
        )} – ${convertUtcToPt(
          createPaymentDetailedReportDto.toDateTime,
          'MMM. D, YYYY, hh:mm A Z',
        )}`,
        payments: paymentDopsInput,
        refunds: refundDopsInput,
        summaryPayments: formatSummaryPaymentDopsInput,
        summaryPermits: formatSummaryPermitDopsInput,
      },
      generatedDocumentFileName: 'Sample',
    };

    await this.dopsService.generateReport(currentUser, generateReportData, res);
  }

  async createPaymentSummaryReport(
    currentUser: IUserJWT,
    createPaymentSummaryReportDto: CreatePaymentSummaryReportDto,
    res: Response,
  ): Promise<void> {
    // const formatSummaryPermitDopsInput =
    //   await this.formatPermitSummaryForDopsInput(
    //     paymentCodes,
    //     permitTypes,
    //     createPaymentDetailedReportDto,
    //   );

    // const purchasePaymentMethodAmountMap = new Map<string, number>();

    // const purchasePaymentDetails: IPaymentReportData[] =
    //   await this.getTransactionDetailsFromDb(
    //     TransactionType.PURCHASE,
    //     paymentCodes,
    //     permitTypes,
    //     createPaymentDetailedReportDto,
    //     purchasePaymentMethodAmountMap,
    //   );

    // const paymentDopsInput = this.formatTransactionDataForDopsInput(
    //   purchasePaymentDetails,
    // );

    // const refundPaymentMethodAmountMap = new Map<string, number>();

    // const refundDetails: IPaymentReportData[] =
    //   await this.getTransactionDetailsFromDb(
    //     TransactionType.REFUND,
    //     paymentCodes,
    //     permitTypes,
    //     createPaymentDetailedReportDto,
    //     refundPaymentMethodAmountMap,
    //   );

    // const refundDopsInput =
    //   this.formatTransactionDataForDopsInput(refundDetails);

    // const formatSummaryPaymentDopsInput = this.formatPaymentSummaryForDopsInput(
    //   paymentCodes,
    //   purchasePaymentMethodAmountMap,
    //   refundPaymentMethodAmountMap,
    // );

    const generateReportData: DopsGeneratedReport = {
      reportTemplate: ReportTemplate.PAYMENT_AND_REFUND_SUMMARY_REPORT,
      reportData: {
        issuedBy: createPaymentSummaryReportDto.issuedBy.join(', '),
        runDate: convertUtcToPt(new Date(), 'MMM. D, YYYY, hh:mm A Z'),
        timePeriod: `${convertUtcToPt(
          createPaymentSummaryReportDto.fromDateTime,
          'MMM. D, YYYY, hh:mm A Z',
        )} – ${convertUtcToPt(
          createPaymentSummaryReportDto.toDateTime,
          'MMM. D, YYYY, hh:mm A Z',
        )}`,
        // payments: paymentDopsInput,
        // refunds: refundDopsInput,
        // summaryPayments: formatSummaryPaymentDopsInput,
        // summaryPermits: formatSummaryPermitDopsInput,
      },
      generatedDocumentFileName: 'Sample',
    };

    await this.dopsService.generateReport(currentUser, generateReportData, res);
  }

  async findTransactionDataForSummaryReports(
    transactionType: TransactionType,
    paymentCode: IPaymentCode,
    permitTypes: PermitTypeReport[],
    createPaymentDetailedReportDto: CreatePaymentDetailedReportDto,
  ): Promise<IPaymentReportData> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('trans');

    queryBuilder
      .select('trans.paymentMethodTypeCode', 'paymentMethod')
      .addSelect('permitTransactions.transactionAmount', 'amount');

    queryBuilder
      .innerJoin('trans.permitTransactions', 'permitTransactions')
      .innerJoin('permitTransactions.permit', 'permit');

    queryBuilder.where('trans.transactionTypeId = :transactionType', {
      transactionType: transactionType,
    });

    queryBuilder.andWhere('permit.permitStatus = :permitStatus', {
      permitStatus: ApplicationStatus.ISSUED,
    });

    queryBuilder.andWhere('permit.permitIssueDateTime >= :fromDateTime', {
      fromDateTime: createPaymentDetailedReportDto.fromDateTime,
    });
    queryBuilder.andWhere('permit.permitIssueDateTime < :toDateTime', {
      toDateTime: createPaymentDetailedReportDto.toDateTime,
    });

    if (createPaymentDetailedReportDto.issuedBy?.length) {
      queryBuilder.andWhere('permit.permitIssuedBy IN (:...issuedBy)', {
        issuedBy: createPaymentDetailedReportDto.issuedBy,
      });
    }

    queryBuilder.orderBy('permit.permitIssueDateTime');

    const paymentReportDataCollection: IPaymentReportDataDetails[] =
      await queryBuilder.getRawMany();

    let subtotal = 0;

    paymentReportDataCollection.forEach((paymentReportData) => {
      subtotal += paymentReportData.amount;
    });

    const paymentReportData: IPaymentReportData = {
      paymentReportData: paymentReportDataCollection,
      totalAmount: subtotal,
      paymentMethod: undefined,
    };

    return paymentReportData;
  }
}
