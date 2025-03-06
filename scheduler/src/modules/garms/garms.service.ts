import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GarmsExtractFile } from './entities/garms-extract-file.entity';
import { IsNull, Repository } from 'typeorm';
import { GarmsFileTransaction } from './entities/garms-file-transaction.entity';
import { GarmsExtractType } from '../common/enum/garms-extract-type.enum';
import { Transaction } from '../common/entities/transaction.entity';
import { PERMIT_STATUS } from '../common/enum/application-status.enum';
import {
  GARMS_CASH_FILE_TRANSACTION_TYPE,
  GARMS_CREDIT_FILE_TRANSACTION_TYPE,
} from 'src/common/enum/payment-method-type.enum';
import { PermitType } from '../common/entities/permit-type.entity';
import {
  createGarmsCashFile,
  getPreviousDayAtNinePM,
} from 'src/helper/garms.helper';

@Injectable()
export class GarmsService {
  constructor(
    @InjectRepository(GarmsExtractFile)
    private garmsExtractFileRepository: Repository<GarmsExtractFile>,
    @InjectRepository(GarmsFileTransaction)
    private fileTransactionRepository: Repository<GarmsFileTransaction>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(PermitType)
    private permitTypeRepository: Repository<PermitType>,
  ) {}

  async processTransactions(garmsExtractType: GarmsExtractType) {
    const oldFile = await this.getOldFile(garmsExtractType);
    const { fileId, fromTimestamp, toTimestamp } = oldFile;

    if (garmsExtractType === GarmsExtractType.CASH) {
      console.log(fileId, fromTimestamp, toTimestamp);
    }

    // Fetch transactions based on the provided timestamps
    const transactions = await this.getTransactionWithPermitDetails(
      fromTimestamp,
      toTimestamp,
      garmsExtractType,
    );

    if (garmsExtractType === GarmsExtractType.CASH)
      createGarmsCashFile(transactions, garmsExtractType);
    await this.getPermitTypeServiceCodes();
    await this.saveTransactionIds(transactions, fileId);
    await this.updateFileSubmitTimestamp(oldFile);
  }

  private async saveTransactionIds(
    transactions: Transaction[],
    fileId: string,
  ) {
    const fileTransactions: GarmsFileTransaction[] = transactions.map(
      (transaction) => {
        const fileTransaction = new GarmsFileTransaction();
        fileTransaction.fileId = fileId;
        fileTransaction.transactionId = transaction.transactionId;
        return fileTransaction;
      },
    );

    // Save accumulated transaction ids into the garms file transaction table
    await this.fileTransactionRepository.save(fileTransactions);
  }

  private async updateFileSubmitTimestamp(oldFile) {
    // Update submit timestamp in garms file extract table
    await this.garmsExtractFileRepository.save({
      ...oldFile,
      fileSubmitTimestamp: new Date(),
    });
  }

  private async getOldFile(garmsExtractType: GarmsExtractType) {
    const oldFile = await this.findUnsubmittedOldFile(garmsExtractType);

    if (oldFile) {
      console.log(
        'Found unsubmitted record. old unsubmitted record : ',
        oldFile,
      );
      return this.updateOldFileRecord(oldFile);
    } else {
      console.log('Creating new record: ');
      return this.createNewFileRecord(garmsExtractType);
    }
  }

  private async findUnsubmittedOldFile(
    transactionType: GarmsExtractType,
  ): Promise<GarmsExtractFile | null> {
    return this.garmsExtractFileRepository.findOne({
      where: {
        fileSubmitTimestamp: IsNull(),
        garmsExtractType: transactionType,
      },
    });
  }

  private async updateOldFileRecord(oldFile: GarmsExtractFile) {
    const updatedOldRecord = await this.garmsExtractFileRepository.save({
      ...oldFile,
      toDate: getPreviousDayAtNinePM(),
    });
    console.log('updated old record to: ', updatedOldRecord);

    return {
      fileId: updatedOldRecord.fileId,
      fromTimestamp: updatedOldRecord.fromTimestamp,
      toTimestamp: updatedOldRecord.toTimestamp,
    };
  }

  private async createNewFileRecord(garmsExtractType: GarmsExtractType) {
    const latestFile = await this.getLatestFile(garmsExtractType);
    if (latestFile) {
      console.log('latestFile found.');

      const newFile = new GarmsExtractFile();
      newFile.fromTimestamp = latestFile.toTimestamp;
      newFile.toTimestamp = getPreviousDayAtNinePM();
      newFile.garmsExtractType = garmsExtractType;

      const savedFile = await this.garmsExtractFileRepository.save(newFile);
      console.log('savedfile: ', savedFile);
      return {
        fileId: savedFile.fileId,
        fromTimestamp: savedFile.fromTimestamp,
        toTimestamp: savedFile.toTimestamp,
      };
    }
    console.log('No data to process for GARMS');
  }

  private async getLatestFile(garmsExtractType: GarmsExtractType) {
    const [latestFile] = await this.garmsExtractFileRepository.find({
      where: { garmsExtractType: garmsExtractType },
      order: { toTimestamp: 'DESC' },
      take: 1,
    });
    console.log('latest file: ', latestFile);
    return latestFile;
  }

  async getTransactionWithPermitDetails(
    fromTimestamp: Date,
    toTimestamp: Date,
    garmsExtractType: GarmsExtractType,
  ) {
    const transactionType =
      garmsExtractType === GarmsExtractType.CASH
        ? GARMS_CASH_FILE_TRANSACTION_TYPE
        : GARMS_CREDIT_FILE_TRANSACTION_TYPE;
    let qb = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.permitTransactions', 'permitTransaction')
      .leftJoinAndSelect('permitTransaction.permit', 'permit');
    if (garmsExtractType === GarmsExtractType.CREDIT) {
      qb = qb.leftJoinAndSelect('permit.parmitData', 'permitData');
    }
    const result = await qb
      .andWhere('transaction.transactionSubmitDate > :fromTimestamp', {
        fromTimestamp,
      })
      .andWhere('transaction.transactionSubmitDate <= :toTimestamp', {
        toTimestamp,
      })
      .andWhere('transaction.paymentMethodTypeCode IN (:...garmsExtractType)', {
        garmsExtractType: transactionType,
      })
      .andWhere('permit.permitNumber IS NOT NULL')
      .andWhere('permit.permitStatus IN (:...permitStatus)', {
        permitStatus: PERMIT_STATUS,
      })
      .getMany();
    return result;
  }
  private async getPermitTypeServiceCodes(): Promise<Map<string, string>> {
    const permitTypes = await this.permitTypeRepository.find();
    const permitTypeServiceCodes = new Map<string, string>();
    permitTypes.forEach((permitType) => {
      permitTypeServiceCodes.set(
        permitType.permitTypeId,
        permitType.serviceCode,
      );
    });
    console.log('service codes', permitTypeServiceCodes);
    return permitTypeServiceCodes;
  }
}
