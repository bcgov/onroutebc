import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionDetail } from './transaction-detail.entity';
import { Cron } from '@nestjs/schedule';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { generate } from 'src/helper/generator.helper';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionDetail)
    private readonly cfsTransactionDetailRepo: Repository<TransactionDetail>
  ) {}

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

  private currentDate = new Date();
  private holidays: string[] = [
    this.getNewYearsDay(), // New Year's Day
    this.getThirdMondayOfFeb(this.currentDate.getFullYear()), // Family Day (3rd Monday in February)
    this.getGoodFriday(this.currentDate.getFullYear()), // Good Friday
    this.getEasterMonday(this.currentDate.getFullYear()), // Easter Monday
    this.getMondayBeforMay25(this.currentDate.getFullYear()), // Victoria Day (Monday before May 25)
    this.getCanadaDay(this.currentDate.getFullYear()), // Canada Day
    this.getFirstMondayOfAugust(this.currentDate.getFullYear()), // British Columbia Day (1st Monday in August)
    this.getFirstMondayOfSeptember(this.currentDate.getFullYear()), // Labour Day (1st Monday in September)
    this.getSecondMondayOfOctober(this.currentDate.getFullYear()), // Thanksgiving Day (2nd Monday in October)
    this.getRemembranceDay(this.currentDate.getFullYear()), // Remembrance Day
    this.getChristmasDay(this.currentDate.getFullYear()), // Christmas Day
    this.getBoxingDay(this.currentDate.getFullYear()), // Boxing Day
  ];

  private getNewYearsDay(): string {
    const currentYear = new Date().getFullYear();
    const newYearsDay = new Date(currentYear, 0, 1); // January is 0
    const dateString = newYearsDay.toISOString().slice(0, 10);
    return dateString;
  }

  private getEasterSunday(year: number): Date {
    const f = Math.floor;
    const G = year % 19;
    const C = f(year / 100);
    const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
    const I = H - f(H / 28) * (1 - f(H / 28) * f(29 / (H + 1)) * f((21 - G) / 11));
    const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
    const L = I - J;
    const month = 3 + f((L + 40) / 44);
    const day = L + 28 - 31 * f(month / 4);

    return new Date(year, month - 1, day);
  }

  private getGoodFriday(year: number): string {
    const easterSunday = this.getEasterSunday(year);
    const goodFriday = new Date(easterSunday);
    goodFriday.setDate(easterSunday.getDate() - 2);
    const dateString = goodFriday.toISOString().slice(0, 10);
    return dateString;
  }

  private getEasterMonday(year: number): string {
    const easterSunday = this.getEasterSunday(year);
    const easterMonday = new Date(easterSunday);
    easterMonday.setDate(easterSunday.getDate() + 1);
    const dateString = easterMonday.toISOString().slice(0, 10);
    return dateString;
  }

  private getCanadaDay(year: number): string {
    const canadaDay = new Date(year, 6, 1); // July is 6
    const dateString = canadaDay.toISOString().slice(0, 10);
    return dateString;
  }
  

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

  private getRemembranceDay(year: number): string {
    const remembranceDay = new Date(year, 10, 11); // November is 10
    const dateString = remembranceDay.toISOString().slice(0, 10);
    return dateString;
  }

  private getChristmasDay(year: number): string {
    const christmasDay = new Date(year, 11, 25); // December is 11
    const dateString = christmasDay.toISOString().slice(0, 10);
    return dateString;
  }

  private getBoxingDay(year: number): string {
    const boxingDay = new Date(year, 11, 26); // December is 11
    const dateString = boxingDay.toISOString().slice(0, 10);
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
