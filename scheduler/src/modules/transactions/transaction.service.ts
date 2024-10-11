import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { CfsTransactionDetail } from '../common/entities/transaction-detail.entity';
import { Cron } from '@nestjs/schedule';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { generate } from 'src/helper/generator.helper';
import { In, Repository } from 'typeorm';
import { Holiday } from './holiday.entity';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { addToCache } from 'src/common/helper/cache.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheKey } from 'src/common/enum/cache-key.enum';
import { Cache } from 'cache-manager';
import { getFromCache } from 'src/common/helper/cache.helper';

dayjs.extend(utc);

let transactionIds = [];

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  private holidays: string[] = [];
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(CfsTransactionDetail)
    private readonly cfsTransactionDetailRepo: Repository<CfsTransactionDetail>,
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
  ) {
    void this.initializeHolidays();
  }

  private async initializeHolidays(): Promise<void> {
    const cachedHolidays = await getFromCache(
      this.cacheManager,
      CacheKey.HOLIDAYS,
    );

    if (!cachedHolidays) {
      this.holidays = await this.getBcHolidays();
    } else {
      cachedHolidays;
    }
  }

  async getHolidays(): Promise<Holiday[]> {
    const now: Date = new Date();
    const year = now.getFullYear().toString();
    const holidays = await this.holidayRepository
      .createQueryBuilder('holiday')
      .where('YEAR(holiday.holidayDate) = :year', { year })
      .getMany();

    // Convert holidayDate to UTC format
    return holidays.map((holiday) => ({
      ...holiday,
      holidayDate: dayjs.utc(holiday.holidayDate).format('YYYY-MM-DD'),
    }));
  }

  async getTransactionDetails(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoinAndSelect(
        'CfsTransactionDetail',
        'detail',
        'transaction.TRANSACTION_ID = detail.TRANSACTION_ID',
      )
      .where('detail.CFS_FILE_STATUS_TYPE = :status', { status: 'READY' })
      .getMany();

    // Extract transaction IDs from the results
    transactionIds = transactions.map(
      (transaction) => transaction.TRANSACTION_ID,
    );

    if (transactions.length > 0) {
      this.logger.log(transactions);
      return transactions;
    } else {
      this.logger.log('No transactions found with status READY');
      return [];
    }
  }

  async updateCfsFileStatusType(fileName: string): Promise<void> {
    const currentDate = new Date();
    const currentUTCTimestamp = currentDate;
    const transactionDetails: CfsTransactionDetail[] =
      await this.cfsTransactionDetailRepo.find({
        where: { TRANSACTION_ID: In(transactionIds) },
      });
    const updatedTransactionDetails: CfsTransactionDetail[] =
      transactionDetails.map((detail) => {
        detail.CFS_FILE_STATUS_TYPE = 'SENT';
        detail.PROCESSSING_DATE_TIME = currentUTCTimestamp;
        detail.FILE_NAME = fileName;
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

  private async getBcHolidays(): Promise<string[]> {
    try {
      const holidays: Holiday[] = await this.getHolidays();

      const formatHoliday = (holiday: Holiday): string => {
        return dayjs(holiday.holidayDate).format('YYYY-MM-DD');
      };

      const holidayStrings: string[] = holidays.map(formatHoliday);
      const holidayString = holidayStrings.join(',');
      await addToCache(this.cacheManager, CacheKey.HOLIDAYS, holidayString);
      return holidayStrings;
    } catch (error) {
      this.logger.error('Error fetching BC holidays:', error);
      return [];
    }
  }

  private isHoliday(date: Date): boolean {
    const formattedDate = date.toISOString().split('T')[0];
    return this.holidays.includes(formattedDate);
  }

  @Cron('0 30 16 * * 1-5')
  // @Cron(`${process.env.TPS_PENDING_POLLING_INTERVAL || '0 */1 * * * *'}`)
  @LogAsyncMethodExecution()
  async genterateCgifilesAndUpload() {
    const now = new Date();
    if (this.isHoliday(now)) {
      this.logger.log('Today is a holiday. Skipping job execution.');
      return;
    }
    const transactions: Promise<Transaction[]> = this.getTransactionDetails();
    const fileName = await generate(await transactions);
    await this.updateCfsFileStatusType(fileName[0]);
  }
}
