import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionDetail } from './transaction-detail.entity';
import { Cron } from '@nestjs/schedule';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { generate } from 'src/helper/generator.helper';
import { Repository } from 'typeorm';

interface Holiday {
  id: number;
  date: string;
  nameEn: string;
  nameFr: string;
  federal: number;
  observedDate: string;
}

interface Province {
  id: string;
  nameEn: string;
  nameFr: string;
  sourceLink: string;
  sourceEn: string;
  holidays: Holiday[];
  nextHoliday: Holiday;
}

interface HolidayApiResponse {
  province: Province;
}

@Injectable()
export class TransactionService {
  private holidays: string[] = [];
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionDetail)
    private readonly cfsTransactionDetailRepo: Repository<TransactionDetail>
  ) {
    void this.initializeHolidays();
  }

  private async initializeHolidays(): Promise<void> {
    this.holidays = await this.getBcHolidays();
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async getTransactionDetails(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.createQueryBuilder('transaction')
    .innerJoinAndSelect('TransactionDetail', 'detail', 'transaction.TRANSACTION_ID = detail.TRANSACTION_ID')
    .where('detail.CFS_FILE_STATUS_TYPE = :status', { status: 'READY' })
    .getMany();

    if (transactions.length > 0) {
      console.log(transactions);
      return transactions;
    } else {
      console.log('No transactions found with status READY');
      return [];
    }
  }

  async updateCfsFileStatusType(fileName: string): Promise<void> {
    const currentDate = new Date();
    const currentUTCTimestamp = currentDate.toISOString();
    const transactionDetails: TransactionDetail[] = await this.cfsTransactionDetailRepo.find({ where: { CFS_FILE_STATUS_TYPE: 'READY' } });
    const updatedTransactionDetails: TransactionDetail[] = transactionDetails.map(detail => {
      detail.CFS_FILE_STATUS_TYPE = 'SENT';
      detail.PROCESSSING_DATE_TIME = currentUTCTimestamp;
      detail.FILE_NAME = fileName;
      return detail;
    });

    try {
      await this.cfsTransactionDetailRepo.save(updatedTransactionDetails);
      console.log(`Updated transaction details`);
    } catch (error) {
      console.error('Error updating transaction details:', error);
      throw error;
    }
  }

  private async getBcHolidays(): Promise<string[]> {
    const apiUrl = `${process.env.ORBC_HOLIDAYS_API_URL}`
    try {
        const response: Response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: HolidayApiResponse = await response.json() as HolidayApiResponse;
        
        const holidayDates: string[] = data.province.holidays.map((holiday: Holiday) => holiday.date);
        return holidayDates;
    } catch (error) {
        console.error('Error fetching BC holidays:', error);
        return [];
    }
  }

  private isHoliday(date: Date): boolean {
    const formattedDate = date.toISOString().split('T')[0];
    return this.holidays.includes(formattedDate);
  }

  @Cron('30 16 * * 1-5')
  @LogAsyncMethodExecution()
  async genterateCgifilesAndUpload() {
    const now = new Date();
    if (this.isHoliday(now)) {
      console.log('Today is a holiday. Skipping job execution.');
       return;
     }
    const transactions: Promise<Transaction[]> = this.getTransactionDetails();
    const fileName = await generate(await transactions);
    await this.updateCfsFileStatusType(fileName);
  }
}