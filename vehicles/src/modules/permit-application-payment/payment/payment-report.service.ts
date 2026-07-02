import { Inject, Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { PaymentMethodTypeReport } from '../../../common/enum/payment-method-type.enum';
import { PaymentCardType as PaymentCardTypeEnum } from '../../../common/enum/payment-card-type.enum';
import { TransactionType } from '../../../common/enum/transaction-type.enum';
import { Response } from 'express';
import { CreatePaymentDetailedReportDto } from './dto/request/create-payment-detailed-report.dto';
import { DopsService } from '../../common/dops.service';
import { DopsGeneratedReport } from '../../../common/interface/dops-generated-report.interface';
import { ReportTemplate } from '../../../common/enum/report-template.enum';
import { convertUtcToPt } from '../../../common/helper/date-time.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IPaymentCode } from '../../../common/interface/payment-code.interface';
import { PermitTypeReport } from '../../../common/enum/permit-type.enum';
import { CreatePaymentSummaryReportDto } from './dto/request/create-payment-summary-report.dto';
import { PermitIssuedBy } from '../../../common/enum/permit-issued-by.enum';
import { PaymentMethodType } from './entities/payment-method-type.entity';
import { PaymentCardType } from './entities/payment-card-type.entity';
import { getPaymentCodeFromCache } from '../../../common/helper/payment.helper';
import { LogAsyncMethodExecution } from '../../../common/decorator/log-async-method-execution.decorator';
import { Directory } from '../../../common/enum/directory.enum';

@Injectable()
export class PaymentReportService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly dopsService: DopsService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private getSelectQueryBuilderForDetailedReports(
    queryBuilder: SelectQueryBuilder<Transaction>,
  ) {
    queryBuilder
      .select(
        `CONCAT_WS(' - ', paymentMethodType.name, paymentCardType.name )`,
        'paymentMethod',
      )
      .addSelect('permit.permitIssueDateTime', 'issuedOn')
      .addSelect('trans.transactionOrderNumber', 'orbcTransactionId')
      .addSelect('trans.pgTransactionId', 'providerTransactionId')
      .addSelect('receipt.receiptNumber', 'receiptNo')
      .addSelect('permit.permitNumber', 'permitNo')
      .addSelect('permit.permitType', 'permitType')
      .addSelect('permitTransactions.transactionAmount', 'amount')
      .addSelect(
        `ISNULL(issuer.userName,'${PermitIssuedBy.SELF_ISSUED}')`,
        'users',
      );
  }

  private getSelectQueryBuilderForPaymentAndRefundSummary(
    queryBuilder: SelectQueryBuilder<Transaction>,
  ) {
    queryBuilder
      .select(
        `CONCAT_WS(' - ', paymentMethodType.name, paymentCardType.name )`,
        'paymentMethod',
      )
      .addSelect('trans.transactionTypeId', 'transactionType')
      .addSelect(
        `SUM(permitTransactions.transactionAmount) OVER (PARTITION BY trans.transactionTypeId, trans.paymentMethodTypeCode, trans.paymentCardTypeCode)`,
        'amount',
      )
      .distinct();
  }

  private getSelectQueryBuilderForPermitSummary(
    queryBuilder: SelectQueryBuilder<Transaction>,
  ) {
    queryBuilder
      .select('permit.permitType', 'permitType')
      .addSelect(
        'COUNT(permit.permitType) OVER (PARTITION BY permit.permitType)',
        'permitCount',
      )
      .distinct();
  }

  private getTargetQueryBuilderForReports(
    queryBuilder: SelectQueryBuilder<Transaction>,
  ) {
    queryBuilder
      .innerJoin(
        PaymentMethodType,
        'paymentMethodType',
        'trans.paymentMethodTypeCode = paymentMethodType.paymentMethodTypeCode',
      )
      .leftJoin(
        PaymentCardType,
        'paymentCardType',
        'trans.paymentCardTypeCode = paymentCardType.paymentCardTypeCode',
      )
      .innerJoin('trans.permitTransactions', 'permitTransactions')
      .innerJoin('trans.receipt', 'receipt')
      .innerJoin('permitTransactions.permit', 'permit')
      .leftJoin('permit.issuer', 'issuer', 'issuer.directory = :directory', {
        directory: Directory.IDIR,
      });
  }

  private getCondtionQueryBuilderForDetailedReports(
    queryBuilder: SelectQueryBuilder<Transaction>,
    transactionTypes: TransactionType[],
    reportDto: CreatePaymentDetailedReportDto,
    paymentMethodTypeCodes: PaymentMethodTypeReport[],
    paymentCardTypeCodes: PaymentCardTypeEnum[],
    permitTypes: PermitTypeReport[],
  ) {
    if (transactionTypes?.length) {
      queryBuilder.where('trans.transactionTypeId IN (:...transactionTypes)', {
        transactionTypes: transactionTypes,
      });
    }

    queryBuilder.andWhere('trans.transactionApprovedDate >= :fromDateTime', {
      fromDateTime: reportDto.fromDateTime,
    });
    queryBuilder.andWhere('trans.transactionApprovedDate < :toDateTime', {
      toDateTime: reportDto.toDateTime,
    });

    if (paymentMethodTypeCodes?.length) {
      queryBuilder.andWhere(
        'trans.paymentMethodTypeCode IN (:...paymentMethodTypeCodes)',
        { paymentMethodTypeCodes: paymentMethodTypeCodes },
      );

      queryBuilder.andWhere(
        '(trans.paymentCardTypeCode IS NULL OR trans.paymentCardTypeCode IN (:...paymentCardTypeCodes))',
        { paymentCardTypeCodes: paymentCardTypeCodes },
      );
    }

    if (permitTypes?.length) {
      queryBuilder.andWhere('permit.permitType IN (:...permitTypes)', {
        permitTypes: Object.values(permitTypes).filter(
          (x) => x != PermitTypeReport.ALL,
        ),
      });
    }

    if (reportDto.issuedBy?.length) {
      if (
        reportDto.issuedBy.includes(PermitIssuedBy.SELF_ISSUED) &&
        !reportDto.issuedBy.includes(PermitIssuedBy.PPC)
      ) {
        queryBuilder.andWhere('permit.permitIssuedBy = :issuedBy', {
          issuedBy: PermitIssuedBy.SELF_ISSUED,
        });
      } else if (
        reportDto.issuedBy.includes(PermitIssuedBy.SELF_ISSUED) &&
        reportDto.issuedBy.includes(PermitIssuedBy.PPC) &&
        reportDto.users?.length
      ) {
        queryBuilder.andWhere(
          '(permit.permitIssuedBy = :issuedBy OR issuer.userGUID IN (:...issuerUserGuids))',
          {
            issuedBy: PermitIssuedBy.SELF_ISSUED,
            issuerUserGuids: reportDto.users,
          },
        );
      } else if (
        reportDto.issuedBy.includes(PermitIssuedBy.PPC) &&
        reportDto.users?.length
      ) {
        queryBuilder.andWhere('issuer.userGUID IN (:...issuerUserGuids)', {
          issuerUserGuids: reportDto.users,
        });
      }
    }
  }

  @LogAsyncMethodExecution()
  async findTransactionDataForDetailedReports(
    transactionTypes: TransactionType[],
    createPaymentDetailedReportDto: CreatePaymentDetailedReportDto,
    paymentMethodTypeCodes: PaymentMethodTypeReport[],
    paymentCardTypeCodes: PaymentCardTypeEnum[],
    permitTypes: PermitTypeReport[],
  ): Promise<unknown> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('trans');

    this.getSelectQueryBuilderForDetailedReports(queryBuilder);

    this.getTargetQueryBuilderForReports(queryBuilder);

    this.getCondtionQueryBuilderForDetailedReports(
      queryBuilder,
      transactionTypes,
      createPaymentDetailedReportDto,
      paymentMethodTypeCodes,
      paymentCardTypeCodes,
      permitTypes,
    );

    queryBuilder.orderBy('paymentMethod');
    queryBuilder.addOrderBy('permit.permitIssueDateTime');

    interface IPaymentReportDataDetails {
      paymentMethod: string;
      orbcTransactionId: string;
      providerTransactionId: string;
      amount: number; //To be changed to Decimal.js
      receiptNo: string;
      permitType: string;
      permitNo: string;
      issuedOn: string;
      users: string;
    }

    const paymentReportDataCollection: IPaymentReportDataDetails[] =
      await queryBuilder.getRawMany();

    if (paymentReportDataCollection?.length) {
      return paymentReportDataCollection as unknown;
    }
  }

  @LogAsyncMethodExecution()
  async findSummaryPaymentAndRefundDataForDetailedReports(
    transactionType: TransactionType[],
    reportDto: CreatePaymentDetailedReportDto | CreatePaymentSummaryReportDto,
    paymentMethodTypeCodes?: PaymentMethodTypeReport[],
    paymentCardTypeCodes?: PaymentCardTypeEnum[],
    permitTypes?: PermitTypeReport[],
  ): Promise<unknown> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('trans');

    this.getSelectQueryBuilderForPaymentAndRefundSummary(queryBuilder);

    this.getTargetQueryBuilderForReports(queryBuilder);

    if ('paymentCodes' in reportDto) {
      this.getCondtionQueryBuilderForDetailedReports(
        queryBuilder,
        transactionType,
        reportDto,
        paymentMethodTypeCodes,
        paymentCardTypeCodes,
        permitTypes,
      );
    } else {
      this.getCondtionQueryBuilderForSummaryReports(
        queryBuilder,
        transactionType,
        reportDto,
      );
    }

    queryBuilder.orderBy('paymentMethod');
    queryBuilder.addOrderBy('trans.transactionTypeId');

    interface QueryResultInterface {
      transactionType: TransactionType;
      paymentMethod: string;
      amount: number;
    }

    const queryResult: QueryResultInterface[] = await queryBuilder.getRawMany();

    interface SummaryPaymentsInterface {
      paymentMethod: string;
      payment: number;
      refund: number;
      deposit: number;
    }

    // Create a map to store the payment methods and their corresponding payments, refunds, and deposits
    const paymentMap = new Map<string, SummaryPaymentsInterface>();

    queryResult.forEach((item) => {
      const payment =
        item.transactionType === TransactionType.PURCHASE ? item.amount : null;
      const refund =
        item.transactionType === TransactionType.REFUND ? item.amount : null;
      const deposit = (payment || 0) - (refund || 0);
      const summaryPayment = paymentMap.get(item.paymentMethod);
      if (summaryPayment) {
        // If the payment method already exists in the map, update the payment, refund, and deposit
        summaryPayment.payment = payment || summaryPayment.payment;
        summaryPayment.refund = refund || summaryPayment.refund;
        summaryPayment.deposit =
          (summaryPayment.payment || 0) - (summaryPayment.refund || 0);
      } else {
        // If the payment method does not exist in the map, add it
        paymentMap.set(item.paymentMethod, {
          paymentMethod: item.paymentMethod,
          payment: payment,
          refund: refund,
          deposit: deposit,
        });
      }
    });

    // Convert the map values to an array
    const summaryPayments = Array.from(paymentMap.values());

    const totalPayment = summaryPayments.reduce(
      (a, b) => a + (b.payment || 0),
      0,
    );
    const totalRefund = summaryPayments.reduce(
      (a, b) => a + (b.refund || 0),
      0,
    );
    const total = {
      paymentMethod: 'totalAmount',
      payment: totalPayment === 0 ? null : totalPayment,
      refund: totalRefund === 0 ? null : totalRefund,
      deposit: summaryPayments.reduce((a, b) => a + (b.deposit || 0), 0),
    };

    summaryPayments.push(total);

    if (summaryPayments?.length) {
      return summaryPayments as unknown;
    }
  }

  @LogAsyncMethodExecution()
  async findSummaryPermitDataForDetailedReports(
    transactionType: TransactionType[],
    reportDto: CreatePaymentDetailedReportDto | CreatePaymentSummaryReportDto,
    paymentMethodTypeCodes?: PaymentMethodTypeReport[],
    paymentCardTypeCodes?: PaymentCardTypeEnum[],
    permitTypes?: PermitTypeReport[],
  ): Promise<unknown> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('trans');

    this.getSelectQueryBuilderForPermitSummary(queryBuilder);

    this.getTargetQueryBuilderForReports(queryBuilder);

    if ('paymentCodes' in reportDto) {
      this.getCondtionQueryBuilderForDetailedReports(
        queryBuilder,
        transactionType,
        reportDto,
        paymentMethodTypeCodes,
        paymentCardTypeCodes,
        permitTypes,
      );
    } else {
      this.getCondtionQueryBuilderForSummaryReports(
        queryBuilder,
        transactionType,
        reportDto,
      );
    }

    queryBuilder.orderBy('permitType');

    interface QueryResultInterface {
      permitType: string;
      permitCount: number;
    }

    const queryResult: QueryResultInterface[] = await queryBuilder.getRawMany();

    // Calculate the total permit count
    const totalPermitCount = queryResult.reduce(
      (total, item) => total + item.permitCount,
      0,
    );

    // Append a new object with the total permit count
    queryResult.push({
      permitType: 'totalPermitCount',
      permitCount: totalPermitCount,
    });

    if (queryResult?.length) {
      return queryResult as unknown;
    }
  }

  private async getConsolidatedPaymentMethodFromDto(
    createPaymentDetailedReportDto: CreatePaymentDetailedReportDto,
  ) {
    const paymentCodes: IPaymentCode[] = [];
    for (const paymentCode of createPaymentDetailedReportDto.paymentCodes) {
      const paymentCodeTemp = await getPaymentCodeFromCache(
        this.cacheManager,
        paymentCode.paymentMethodTypeCode,
        paymentCode.paymentCardTypeCode,
      );

      paymentCodes.push(paymentCodeTemp);
    }

    paymentCodes.sort((a, b) =>
      a.consolidatedPaymentMethod.localeCompare(b.consolidatedPaymentMethod),
    );
    return paymentCodes;
  }

  @LogAsyncMethodExecution()
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

    const paymentMethodTypeCodes = [
      ...new Set(
        createPaymentDetailedReportDto?.paymentCodes.map(
          (item) => item.paymentMethodTypeCode,
        ),
      ),
    ];
    const paymentCardTypeCodes: PaymentCardTypeEnum[] = [
      ...new Set(
        createPaymentDetailedReportDto?.paymentCodes.map(
          (item) => item.paymentCardTypeCode,
        ),
      ),
    ];

    const paymentTransactions =
      await this.findTransactionDataForDetailedReports(
        [TransactionType.PURCHASE],
        createPaymentDetailedReportDto,
        paymentMethodTypeCodes,
        paymentCardTypeCodes,
        permitTypes,
      );

    const refundTransactions = await this.findTransactionDataForDetailedReports(
      [TransactionType.REFUND],
      createPaymentDetailedReportDto,
      paymentMethodTypeCodes,
      paymentCardTypeCodes,
      permitTypes,
    );

    const paymentAndRefundSummary =
      await this.findSummaryPaymentAndRefundDataForDetailedReports(
        [TransactionType.PURCHASE, TransactionType.REFUND],
        createPaymentDetailedReportDto,
        paymentMethodTypeCodes,
        paymentCardTypeCodes,
        permitTypes,
      );

    const permitSummary = await this.findSummaryPermitDataForDetailedReports(
      [TransactionType.PURCHASE, TransactionType.REFUND],
      createPaymentDetailedReportDto,
      paymentMethodTypeCodes,
      paymentCardTypeCodes,
      permitTypes,
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
        payments: paymentTransactions,
        refunds: refundTransactions,
        summaryPaymentsAndRefunds: paymentAndRefundSummary,
        summaryPermits: permitSummary,
      },
      generatedDocumentFileName: `PRD_${convertUtcToPt(
        createPaymentDetailedReportDto.fromDateTime,
        'DDMMYYYY',
      )}_${convertUtcToPt(
        createPaymentDetailedReportDto.toDateTime,
        'DDMMYYYY',
      )}`,
    };

    await this.dopsService.generateReport(currentUser, generateReportData, res);
  }

  @LogAsyncMethodExecution()
  async createPaymentSummaryReport(
    currentUser: IUserJWT,
    createPaymentSummaryReportDto: CreatePaymentSummaryReportDto,
    res: Response,
  ): Promise<void> {
    const paymentTransactions = await this.findTransactionDataForSummaryReports(
      [TransactionType.PURCHASE],
      createPaymentSummaryReportDto,
    );

    const refundTransactions = await this.findTransactionDataForSummaryReports(
      [TransactionType.REFUND],
      createPaymentSummaryReportDto,
    );

    const paymentAndRefundSummary =
      await this.findSummaryPaymentAndRefundDataForDetailedReports(
        [TransactionType.PURCHASE, TransactionType.REFUND],
        createPaymentSummaryReportDto,
      );

    const permitSummary = await this.findSummaryPermitDataForDetailedReports(
      [TransactionType.PURCHASE, TransactionType.REFUND],
      createPaymentSummaryReportDto,
    );

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
        payments: paymentTransactions,
        refunds: refundTransactions,
        summaryPaymentsAndRefunds: paymentAndRefundSummary,
        summaryPermits: permitSummary,
      },
      generatedDocumentFileName: `PRS_${convertUtcToPt(
        createPaymentSummaryReportDto.fromDateTime,
        'DDMMYYYY',
      )}_${convertUtcToPt(
        createPaymentSummaryReportDto.toDateTime,
        'DDMMYYYY',
      )}`,
    };

    await this.dopsService.generateReport(currentUser, generateReportData, res);
  }

  private getSelectQueryBuilderForSummaryReports(
    queryBuilder: SelectQueryBuilder<Transaction>,
  ) {
    queryBuilder
      .select(
        `CONCAT_WS(' - ', paymentMethodType.name, paymentCardType.name )`,
        'paymentMethod',
      )
      .addSelect(
        `SUM(permitTransactions.transactionAmount) OVER (PARTITION BY trans.paymentMethodTypeCode, trans.paymentCardTypeCode, issuer.userName)`,
        'amount',
      )
      .addSelect(
        `ISNULL(issuer.userName,'${PermitIssuedBy.SELF_ISSUED}')`,
        'users',
      )
      .distinct();
  }

  private getCondtionQueryBuilderForSummaryReports(
    queryBuilder: SelectQueryBuilder<Transaction>,
    transactionTypes: TransactionType[],
    reportDto: CreatePaymentSummaryReportDto,
  ) {
    if (transactionTypes?.length) {
      queryBuilder.where('trans.transactionTypeId IN (:...transactionTypes)', {
        transactionTypes: transactionTypes,
      });
    }

    queryBuilder.andWhere('trans.transactionApprovedDate >= :fromDateTime', {
      fromDateTime: reportDto.fromDateTime,
    });
    queryBuilder.andWhere('trans.transactionApprovedDate < :toDateTime', {
      toDateTime: reportDto.toDateTime,
    });

    if (reportDto.issuedBy?.length) {
      queryBuilder.andWhere('permit.permitIssuedBy IN (:...permitIssuedBy)', {
        permitIssuedBy: reportDto.issuedBy,
      });
    }
  }

  @LogAsyncMethodExecution()
  async findTransactionDataForSummaryReports(
    transactionTypes: TransactionType[],
    reportDto: CreatePaymentSummaryReportDto,
  ): Promise<unknown> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('trans');

    this.getSelectQueryBuilderForSummaryReports(queryBuilder);

    this.getTargetQueryBuilderForReports(queryBuilder);

    this.getCondtionQueryBuilderForSummaryReports(
      queryBuilder,
      transactionTypes,
      reportDto,
    );

    queryBuilder.orderBy('paymentMethod');
    queryBuilder.addOrderBy('users');
    queryBuilder.addOrderBy('amount');

    interface IPaymentReportDataDetails {
      paymentMethod: string;
      amount: number; //To be changed to Decimal.js
      users: string;
    }

    const paymentReportDataCollection: IPaymentReportDataDetails[] =
      await queryBuilder.getRawMany();

    if (paymentReportDataCollection?.length) {
      return paymentReportDataCollection as unknown;
    }
  }
}
