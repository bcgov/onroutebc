import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { ORBC_CFSTransactionDetail } from './transaction-detail.entity';
import { ORBC_CFSTransactionDetailRepository } from './transaction-detail.repository';
import { TransactionRepository } from './transaction.repository';
import { Cron } from '@nestjs/schedule';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { generate } from 'src/helper/generator.helper';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    private readonly cfsTransactionDetailRepo: ORBC_CFSTransactionDetailRepository
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async getTransactionDetails(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.createQueryBuilder('transaction')
    .innerJoinAndSelect('ORBC_CFSTransactionDetail', 'detail', 'transaction.TRANSACTION_ID = detail.TRANSACTION_ID')
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
    const transactionDetails: ORBC_CFSTransactionDetail[] = await this.cfsTransactionDetailRepo.find({ where: { CFS_FILE_STATUS_TYPE: 'READY' } });
    const updatedTransactionDetails: ORBC_CFSTransactionDetail[] = transactionDetails.map(detail => {
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

  private currentDate = new Date();
  private holidays: string[] = [
    '2024-01-01', // New Year's Day
    this.getThirdMondayOfFeb(this.currentDate.getFullYear()), // Family Day (3rd Monday in February)
    '2024-03-29', // Good Friday
    '2024-04-01', // Easter Monday
    this.getMondayBeforMay25(this.currentDate.getFullYear()), // Victoria Day (Monday before May 25)
    '2024-07-01', // Canada Day
    this.getFirstMondayOfAugust(this.currentDate.getFullYear()), // British Columbia Day (1st Monday in August)
    this.getFirstMondayOfSeptember(this.currentDate.getFullYear()), // Labour Day (1st Monday in September)
    this.getSecondMondayOfOctober(this.currentDate.getFullYear()), // Thanksgiving Day (2nd Monday in October)
    '2024-11-11', // Remembrance Day
    '2024-12-25', // Christmas Day
    '2024-12-26', // Boxing Day
  ];

  private getThirdMondayOfFeb(year: number): string {
    const februaryFirst = new Date(year, 1, 1);
    const dayOfWeek = februaryFirst.getDay();
    const firstMondayOffset = (8 - dayOfWeek) % 7;
    const firstMonday = new Date(year, 1, 1 + firstMondayOffset);
    const thirdMonday = new Date(firstMonday);
    thirdMonday.setDate(firstMonday.getDate() + 14);
    const dateString = thirdMonday.toISOString().slice(0, 10);
    return dateString;
  }

  private getFirstMondayOfAugust(year: number): string {
    const augustFirst = new Date(year, 7, 1);
    const dayOfWeek = augustFirst.getDay();
    const firstMondayOffset = (8 - dayOfWeek) % 7;
    const firstMonday = new Date(year, 7, 1 + firstMondayOffset);
    const dateString = firstMonday.toISOString().slice(0, 10);
    return dateString;
  }

  private getMondayBeforMay25(year: number): string {
    const may25 = new Date(year, 4, 25);
    const dayOfWeek = may25.getDay();
    const mondayBeforeMay25 = new Date(may25);
    mondayBeforeMay25.setDate(may25.getDate() - dayOfWeek + 1);
    const dateString = mondayBeforeMay25.toISOString().slice(0, 10);
    return dateString;
  }

  private getFirstMondayOfSeptember(year: number): string {
    const septemberFirst = new Date(year, 8, 1); 
    const dayOfWeek = septemberFirst.getDay();
    const firstMondayOffset = (8 - dayOfWeek) % 7;
    const firstMonday = new Date(year, 8, 1 + firstMondayOffset);
    const dateString = firstMonday.toISOString().slice(0, 10);
    return dateString;
  }

  private getSecondMondayOfOctober(year: number): string {
    const octoberFirst = new Date(year, 9, 1);
    const dayOfWeek = octoberFirst.getDay();
    const secondMondayOffset = (8 + 7 - dayOfWeek) % 7;
    const secondMonday = new Date(year, 9, 1 + secondMondayOffset + 7);
    const dateString = secondMonday.toISOString().slice(0, 10);
    return dateString;
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
