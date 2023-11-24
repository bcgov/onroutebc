import { Inject, Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { ApplicationStatus } from '../../common/enum/application-status.enum';
import { PaymentMethodTypeReport } from '../../common/enum/payment-method-type.enum';
import { TransactionType } from '../../common/enum/transaction-type.enum';
import { Response } from 'express';
import { CreatePaymentDetailedReportDto } from './dto/request/create-payment-detailed-report.dto';
import { DopsService } from '../common/dops.service';
import { DopsGeneratedReport } from '../../common/interface/dops-generated-report.interface';
import { ReportTemplate } from '../../common/enum/report-template.enum';
import { convertUtcToPt } from '../../common/helper/date-time.helper';
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
import { PermitIssuedBy } from '../../common/enum/permit-issued-by.enum';
import { IdirUser } from '../company-user-management/users/entities/idir.user.entity';
import { PaymentMethodType } from './entities/payment-method-type.entity';
import { PaymentCardType } from './entities/payment-card-type.entity';

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
      .addSelect('permitTransactions.transactionAmount', 'amount')
      .addSelect(
        `ISNULL(idirUser.userName,'${PermitIssuedBy.SELF_ISSUED}')`,
        'user',
      );

    queryBuilder
      .innerJoin('trans.permitTransactions', 'permitTransactions')
      .innerJoin('trans.receipt', 'receipt')
      .innerJoin('permitTransactions.permit', 'permit')
      .leftJoin(
        IdirUser,
        'idirUser',
        'permit.issuerUserGuid = idirUser.userGUID',
      );

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
      (acc, { permitCount }) => acc + permitCount,
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
    const asdad = await this.findTransactionDataForSummaryReports(
      TransactionType.PURCHASE,
      null,
      null,
      createPaymentSummaryReportDto,
    );

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
    createPaymentDetailedReportDto: CreatePaymentSummaryReportDto,
  ): Promise<IPaymentReportData> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('trans');

    queryBuilder
      .select(
        `CONCAT_WS(' - ', paymentMethodType.name, paymentCardType.name )`,
        'paymentMethod',
      )
      .addSelect(
        `ISNULL(idirUser.userName,'${PermitIssuedBy.SELF_ISSUED}')`,
        'user',
      )
      .addSelect(
        `SUM(permitTransactions.transactionAmount) OVER (PARTITION BY trans.paymentMethodTypeCode, trans.paymentCardTypeCode, idirUser.userName)`,
        'amount',
      )
      .distinct();

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
      .innerJoin('permitTransactions.permit', 'permit')
      .leftJoin(
        IdirUser,
        'idirUser',
        'permit.issuerUserGuid = idirUser.userGUID',
      );

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

    queryBuilder.orderBy('paymentMethod');

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
