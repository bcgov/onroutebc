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
import {
  PaymentMethodType,
  PaymentMethodTypeReport,
} from '../../common/enum/payment-method-type.enum';
import { TransactionType } from '../../common/enum/transaction-type.enum';
import { UpdatePaymentGatewayTransactionDto } from './dto/request/read-payment-gateway-transaction.dto';
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
import { CreatePaymentSummaryReportDto } from './dto/request/create-payment-summary-report.dto';

@Injectable()
export class PaymentService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly dopsService: DopsService,
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

  async createPaymentDetailedReport(
    currentUser: IUserJWT,
    createPaymentDetailedReportDto: CreatePaymentDetailedReportDto,
    res: Response,
  ): Promise<void> {
    const paymentMethods: string[] = [
      'Cash',
      'Cheque',
      'Icepay - Mastercard',
      'Icepay - Mastercard',
      '(Debit), Icepay - Visa',
      'Icepay - Visa (Debit)',
      'Web - Mastercard (Debit)',
      'Web - Visa (Debit)',
      'PoS - Mastercard (Debit)',
      'PoS - Visa (Debit), PoS - Mastercard',
    ];
    const generateReportData: DopsGeneratedReport = {
      reportTemplate: ReportTemplate.PAYMENT_AND_REFUND_DETAILED_REPORT,
      reportData: {
        issuedBy: createPaymentDetailedReportDto.issuedBy.join(', '),
        runDate: convertUtcToPt(new Date(), 'MMM. D, YYYY, hh:mm A Z'),
        permitType: 'All Permit Types',
        paymentMethod:
          createPaymentDetailedReportDto.paymentMethodType.includes(
            PaymentMethodTypeReport.ALL,
          )
            ? 'All Payment Methods'
            : paymentMethods.join(', '),
        timePeriod: `${convertUtcToPt(
          createPaymentDetailedReportDto.fromDateTime,
          'MMM. D, YYYY, hh:mm A Z',
        )} – ${convertUtcToPt(
          createPaymentDetailedReportDto.toDateTime,
          'MMM. D, YYYY, hh:mm A Z',
        )}`,
        payments: [
          {
            issuedOn: 'Oct. 30, 2023, 09:22 AM, PDT',
            providerTransactionId: '54958324283',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'Web – Mastercard',
            receiptNo: '43568357151',
            permitNo: 'P1-53770773-839',
            permitType: 'TROW',
            user: 'SELF_ISSUED',
            amount: '150',
          },
          {
            issuedOn: 'Oct. 30, 2023, 09:38 AM, PDT',
            providerTransactionId: '3358332068',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'Web – Mastercard',
            receiptNo: '93387040025',
            permitNo: 'P1-82852116-386',
            permitType: 'TROS',
            user: 'SELF_ISSUED',
            amount: '400',
          },
          {
            issuedOn: 'Oct. 30, 2023, 10:12 AM, PDT',
            providerTransactionId: '24361827819',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'Web – Mastercard',
            receiptNo: '40368061459',
            permitNo: 'P1-93529011-657',
            permitType: 'TROW',
            user: 'SELF_ISSUED',
            amount: '100',
          },
          {
            paymentMethod: 'Web – Mastercard',
            subTotalAmount: '$650.00',
          },
          {
            issuedOn: 'Oct. 30, 2023, 11:05 AM, PDT',
            providerTransactionId: '56709123890',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'Web – Visa',
            receiptNo: '10001859',
            permitNo: 'P1-00010001-199',
            permitType: 'TROS',
            user: 'SELF_ISSUED',
            amount: '$100.00',
          },
          {
            paymentMethod: 'Web – Visa',
            subTotalAmount: '$100.00',
          },
          {
            paymentMethod: 'Cash',
            totalAmount: '$750.00',
          },
        ],
        refunds: [
          {
            issuedOn: 'Oct. 31, 2023, 11:22 AM, PDT',
            providerTransactionId: '54958324283',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC - Mastercard',
            receiptNo: '43568357151',
            permitNo: 'P1-53770773-839',
            permitType: 'TROW',
            user: 'ANPETRIC',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 11:38 AM, PDT',
            providerTransactionId: '3358332068',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '93387040025',
            permitNo: 'P1-82852116-386',
            permitType: 'TROS',
            user: 'BABEL',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 01:12 PM, PDT',
            providerTransactionId: '24361827819',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '40368061459',
            permitNo: 'P1-93529011-657',
            permitType: 'TROW',
            user: 'GERIDEOU',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 01:22 PM, PDT',
            providerTransactionId: '54958324283',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '43568357151',
            permitNo: 'P1-53770773-839',
            permitType: 'TROW',
            user: 'ANPETRIC',
            amount: '$10.00',
          },
          {
            paymentMethod: 'PPC - Visa',
            subTotalAmount: '$40.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 11:22 AM, PDT',
            providerTransactionId: '54958324283',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC - Mastercard',
            receiptNo: '43568357151',
            permitNo: 'P1-53770773-839',
            permitType: 'TROW',
            user: 'ANPETRIC',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 11:38 AM, PDT',
            providerTransactionId: '3358332068',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '93387040025',
            permitNo: 'P1-82852116-386',
            permitType: 'TROS',
            user: 'BABEL',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 01:12 PM, PDT',
            providerTransactionId: '24361827819',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '40368061459',
            permitNo: 'P1-93529011-657',
            permitType: 'TROW',
            user: 'GERIDEOU',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 01:22 PM, PDT',
            providerTransactionId: '54958324283',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '43568357151',
            permitNo: 'P1-53770773-839',
            permitType: 'TROW',
            user: 'ANPETRIC',
            amount: '$10.00',
          },
          {
            paymentMethod: 'PPC – Mastercard',
            subTotalAmount: '$40.00',
          },
          {
            paymentMethod: 'PPC – Mastercard',
            totalAmount: '$80.00',
          },
        ],
        summaryPayments: [
          {
            paymentMethod: 'PPC – Mastercard',
            refund: '$40',
            deposit: '$40',
          },
          {
            paymentMethod: 'PPC – Visa',
            refund: '$40',
            deposit: '$40',
          },
          {
            paymentMethod: 'Web – Mastercard',
            payment: '$650',
            deposit: '$650',
          },
          {
            paymentMethod: 'Web – Visa',
            payment: '$100',
            deposit: '$100',
          },
          {
            subTotalPaymentAmount: '$750.00',
            subTotalRefundAmount: '$80.00',
            subTotalDepositAmount: '$670.00',
          },
          {
            grandTotalAmount: '$670.00',
          },
        ],
        summaryPermits: [
          {
            permitType: 'TROS',
            permitCount: '7',
          },
          {
            permitType: 'TROW',
            permitCount: '7',
          },
          {
            totalPermits: '14',
          },
        ],
      },
      generatedDocumentFileName: 'Detailed Report',
    };

    await this.dopsService.generateReport(currentUser, generateReportData, res);
  }

  async createPaymentSummaryReport(
    currentUser: IUserJWT,
    createPaymentSummaryReportDto: CreatePaymentSummaryReportDto,
    res: Response,
  ): Promise<void> {
    const generateReportData: DopsGeneratedReport = {
      reportTemplate: ReportTemplate.PAYMENT_AND_REFUND_SUMMARY_REPORT,
      reportData: {
        issuedBy: createPaymentSummaryReportDto.issuedBy.join(', '),
        runDate: convertUtcToPt(new Date(), 'MMM. D, YYYY, hh:mm A Z'),
        permitType: 'All Permit Types',
        timePeriod: `${convertUtcToPt(
          createPaymentSummaryReportDto.fromDateTime,
          'MMM. D, YYYY, hh:mm A Z',
        )} – ${convertUtcToPt(
          createPaymentSummaryReportDto.toDateTime,
          'MMM. D, YYYY, hh:mm A Z',
        )}`,
        payments: [
          {
            issuedOn: 'Oct. 30, 2023, 09:22 AM, PDT',
            providerTransactionId: '54958324283',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'Web – Mastercard',
            receiptNo: '43568357151',
            permitNo: 'P1-53770773-839',
            permitType: 'TROW',
            user: 'SELF_ISSUED',
            amount: '150',
          },
          {
            issuedOn: 'Oct. 30, 2023, 09:38 AM, PDT',
            providerTransactionId: '3358332068',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'Web – Mastercard',
            receiptNo: '93387040025',
            permitNo: 'P1-82852116-386',
            permitType: 'TROS',
            user: 'SELF_ISSUED',
            amount: '400',
          },
          {
            issuedOn: 'Oct. 30, 2023, 10:12 AM, PDT',
            providerTransactionId: '24361827819',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'Web – Mastercard',
            receiptNo: '40368061459',
            permitNo: 'P1-93529011-657',
            permitType: 'TROW',
            user: 'SELF_ISSUED',
            amount: '100',
          },
          {
            paymentMethod: 'Web – Mastercard',
            subTotalAmount: '$650.00',
          },
          {
            issuedOn: 'Oct. 30, 2023, 11:05 AM, PDT',
            providerTransactionId: '56709123890',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'Web – Visa',
            receiptNo: '10001859',
            permitNo: 'P1-00010001-199',
            permitType: 'TROS',
            user: 'SELF_ISSUED',
            amount: '$100.00',
          },
          {
            paymentMethod: 'Web – Visa',
            subTotalAmount: '$100.00',
          },
          {
            paymentMethod: 'Cash',
            totalAmount: '$750.00',
          },
        ],
        refunds: [
          {
            issuedOn: 'Oct. 31, 2023, 11:22 AM, PDT',
            providerTransactionId: '54958324283',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC - Mastercard',
            receiptNo: '43568357151',
            permitNo: 'P1-53770773-839',
            permitType: 'TROW',
            user: 'ANPETRIC',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 11:38 AM, PDT',
            providerTransactionId: '3358332068',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '93387040025',
            permitNo: 'P1-82852116-386',
            permitType: 'TROS',
            user: 'BABEL',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 01:12 PM, PDT',
            providerTransactionId: '24361827819',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '40368061459',
            permitNo: 'P1-93529011-657',
            permitType: 'TROW',
            user: 'GERIDEOU',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 01:22 PM, PDT',
            providerTransactionId: '54958324283',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '43568357151',
            permitNo: 'P1-53770773-839',
            permitType: 'TROW',
            user: 'ANPETRIC',
            amount: '$10.00',
          },
          {
            paymentMethod: 'PPC - Visa',
            subTotalAmount: '$40.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 11:22 AM, PDT',
            providerTransactionId: '54958324283',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC - Mastercard',
            receiptNo: '43568357151',
            permitNo: 'P1-53770773-839',
            permitType: 'TROW',
            user: 'ANPETRIC',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 11:38 AM, PDT',
            providerTransactionId: '3358332068',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '93387040025',
            permitNo: 'P1-82852116-386',
            permitType: 'TROS',
            user: 'BABEL',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 01:12 PM, PDT',
            providerTransactionId: '24361827819',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '40368061459',
            permitNo: 'P1-93529011-657',
            permitType: 'TROW',
            user: 'GERIDEOU',
            amount: '$10.00',
          },
          {
            issuedOn: 'Oct. 31, 2023, 01:22 PM, PDT',
            providerTransactionId: '54958324283',
            orbcTransactionId: 'OR-678904512857',
            paymentMethod: 'PPC – Mastercard',
            receiptNo: '43568357151',
            permitNo: 'P1-53770773-839',
            permitType: 'TROW',
            user: 'ANPETRIC',
            amount: '$10.00',
          },
          {
            paymentMethod: 'PPC – Mastercard',
            subTotalAmount: '$40.00',
          },
          {
            paymentMethod: 'PPC – Mastercard',
            totalAmount: '$80.00',
          },
        ],
        summaryPayments: [
          {
            paymentMethod: 'PPC – Mastercard',
            refund: '$40',
            deposit: '$40',
          },
          {
            paymentMethod: 'PPC – Visa',
            refund: '$40',
            deposit: '$40',
          },
          {
            paymentMethod: 'Web – Mastercard',
            payment: '$650',
            deposit: '$650',
          },
          {
            paymentMethod: 'Web – Visa',
            payment: '$100',
            deposit: '$100',
          },
          {
            subTotalPaymentAmount: '$750.00',
            subTotalRefundAmount: '$80.00',
            subTotalDepositAmount: '$670.00',
          },
          {
            grandTotalAmount: '$670.00',
          },
        ],
        summaryPermits: [
          {
            permitType: 'TROS',
            permitCount: '7',
          },
          {
            permitType: 'TROW',
            permitCount: '7',
          },
          {
            totalPermits: '14',
          },
        ],
      },
      generatedDocumentFileName: 'Summary Report',
    };

    await this.dopsService.generateReport(currentUser, generateReportData, res);
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
}
