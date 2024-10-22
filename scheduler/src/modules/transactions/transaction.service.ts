import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CfsTransactionDetail } from '../common/entities/transaction-detail.entity';
import { Cron } from '@nestjs/schedule';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import {
  formatDateToCustomString,
  populateBatchHeader,
  populateBatchTrailer,
  populateJournalHeader,
  populateJournalVoucherDetail,
  uploadFile,
} from 'src/common/helper/generator.helper';
import { Brackets, In, Repository } from 'typeorm';
import { Transaction } from '../common/entities/transaction.entity';
import { TransactionStatus } from '../common/enum/transaction-status.enum';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { TIMEZONE_PACIFIC } from 'src/common/constants/api.constant';
import { GlCodeType } from '../common/entities/gl-code-type.entity';
import { GlType } from '../common/enum/gl-type.enum';
import { PaymentMethodType } from 'src/common/enum/payment-method-type.enum';
import { PaymentCardType } from 'src/common/enum/payment-card-type.enum';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(CfsTransactionDetail)
    private readonly cfsTransactionDetailRepo: Repository<CfsTransactionDetail>,
    @InjectRepository(GlCodeType)
    private readonly glCodeTypeRepo: Repository<GlCodeType>,
  ) {}

  async getTransactionDetails(): Promise<Transaction[]> {
    const today = new Date();
    //today PST/PDT timezone
    const pacificDate = dayjs(today).tz(TIMEZONE_PACIFIC);
    // Date logic to convert yesterday's 9pm PST/PDT to UTC
    const yesterday = pacificDate
      .subtract(1, 'day')
      .set('hour', 21)
      .set('minute', 0)
      .set('second', 0)
      .utc()
      .format('YYYY-MM-DDTHH:mm:ssZ');
    // Date logic to convert day before yesterday's 9pm PST/PDT to UTC
    const dayBefore = pacificDate
      .subtract(2, 'day')
      .set('hour', 21)
      .set('minute', 0)
      .set('second', 0)
      .utc()
      .format('YYYY-MM-DDTHH:mm:ssZ');
      console.log('today: ',today);
      console.log('today: ',pacificDate);
      console.log('yesterday: ',yesterday);
      console.log('dayBefore: ',dayBefore);

    let transactionsQuery = this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoinAndSelect(
        'CfsTransactionDetail',
        'detail',
        'transaction.TRANSACTION_ID = detail.TRANSACTION_ID',
      )
      .innerJoinAndSelect(
        'transaction.permitTransactions',
        'permitTransactions',
      )
      .innerJoinAndSelect('permitTransactions.permit', 'permit')
      .where('detail.cfsFileStatus = :status', {
        status: TransactionStatus.READY,
      });
    transactionsQuery = transactionsQuery.andWhere(
      new Brackets((qb) => {
        qb.where(
          `detail.reprocessFlag = 'Y' OR (detail.createdDateTime >= :dayBefore AND detail.createdDateTime < :yesterday)`,
          {
            dayBefore: dayBefore,
            yesterday: yesterday,
          },
        );
      }),
    );
    const transactions = await transactionsQuery.getMany();
    // Extract transaction IDs from the results
    const transactionIds = transactions.map(
      (transaction) => transaction.transactionId,
    );
    await this.updateCfsFileStatusType(
      TransactionStatus.PROCESSING,
      transactionIds,
    );

    if (transactions.length > 0) {
      this.logger.log(transactions);
      return transactions;
    } else {
      this.logger.log('No transactions found with status READY');
      return [];
    }
  }
  async updateCfsFileStatusType(
    status: TransactionStatus,
    transactionIds: string[],
    fileName?: string,
  ): Promise<void> {
    const currentDate = new Date();
    const currentUTCTimestamp = currentDate;
    const transactionDetails: CfsTransactionDetail[] =
      await this.cfsTransactionDetailRepo.find({
        where: { transactionId: In(transactionIds) },
      });
    const updatedTransactionDetails: CfsTransactionDetail[] =
      transactionDetails.map((detail) => {
        detail.cfsFileStatus = status;
        if (status == TransactionStatus.SENT)
          detail.processingDateTime = currentUTCTimestamp;
        if (fileName) detail.fileName = fileName;
        return detail;
      });

    try {
      await this.cfsTransactionDetailRepo.save(updatedTransactionDetails);
      this.logger.log(`Updated transaction details`);
    } catch (error) {
      this.logger.error('Error updating transaction details:', error);
      throw error;
    }
  }

  @Cron('0 30 16 * * 1-5')
  // @Cron(`${process.env.TPS_PENDING_POLLING_INTERVAL || '0 */1 * * * *'}`)
  @LogAsyncMethodExecution()
  async genterateCgifilesAndUpload() {
    try {
      const transactions: Transaction[] = await this.getTransactionDetails();
      const transactionIds = transactions.map(
        (transaction) => transaction.transactionId,
      );
      let batchNumberCounter = 0;
      let lastJVDCounter = 0;
      let fileData = '';

      if (transactions.length) {
        const now: Date = new Date();
        const cgiCustomString: string = formatDateToCustomString(now);
        const cgiFileName =
          `F` + process.env.FEEDER_NUMBER + `.${cgiCustomString}`;
        const cgiTrigerFileName =
          `F` + process.env.FEEDER_NUMBER + `.${cgiCustomString}.TRG`;
        for (const transaction of transactions) {
          batchNumberCounter++;
          lastJVDCounter++;
          const revenueGl = await this.getGlCodeType(
            GlType.REVENUE_GL,
            transaction.paymentMethodTypeCode,
            transaction.paymentCardTypeCode,
          );
          console.log('revenueGl: ', revenueGl);
          const balancingGl = await this.getGlCodeType(
            GlType.BALANCING_GL,
            transaction.paymentMethodTypeCode,
            transaction.paymentCardTypeCode,
          );
          console.log('balancingGl: ', balancingGl);
          const batchHeader: string = populateBatchHeader(batchNumberCounter);
          const journalHeader: string = populateJournalHeader(transaction);
          const journalVoucher = populateJournalVoucherDetail(
            transaction,
            revenueGl,
          );
          const lastJournalVoucher = populateJournalVoucherDetail(
            transaction,
            balancingGl,
            true,
            lastJVDCounter,
          );
          const batchTrailer: string = populateBatchTrailer(
            transaction,
            batchNumberCounter,
          );
          this.logger.log(`File generated: ${cgiFileName}`);
          const cgiTrigerFileName =
            `F` + process.env.FEEDER_NUMBER + `.${cgiCustomString}.TRG`;
          this.logger.log(`${cgiTrigerFileName} generated.`);
          fileData +=
            batchHeader +
            journalHeader +
            journalVoucher +
            lastJournalVoucher +
            batchTrailer;
        }
        this.logger.log(fileData);
        await uploadFile(cgiFileName, Buffer.from(fileData, 'utf8'));
        await uploadFile(cgiTrigerFileName, Buffer.from('', 'utf8'));
        await this.updateCfsFileStatusType(
          TransactionStatus.SENT,
          transactionIds,
          cgiFileName,
        );
      }
    } catch (e) {
      this.logger.error(e);
    }
    return 'hello';
  }

  async getGlCodeType(
    glType: GlType,
    paymentMethodTypeCode: PaymentMethodType,
    paymentCardTypeCode?: PaymentCardType,
  ): Promise<GlCodeType> {
    const glCodeType = await this.glCodeTypeRepo.findOne({where: {
      glType: glType,
      paymentMethodTypeCode: paymentMethodTypeCode,
      paymentCardTypeCode: paymentCardTypeCode,

    }});
    return glCodeType;
  }
}
