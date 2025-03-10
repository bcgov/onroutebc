import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as FTPS from 'ftps';
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
import { createGarmsCashFile, deleteLocalFile } from 'src/common/helper/garms.helper';
import { getToDateForGarms } from 'src/common/helper/date-time.helper';

@Injectable()
export class GarmsService {
  private readonly logger = new Logger(GarmsService.name);

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
    // Fetch transactions based on the provided timestamps
    const transactions = await this.getTransactionWithPermitDetails(
      fromTimestamp,
      toTimestamp,
      garmsExtractType,
    );
    const permitServiceCodes = await this.getPermitTypeServiceCodes();
    if (garmsExtractType === GarmsExtractType.CASH) {
      const fileName = createGarmsCashFile(
        transactions,
        garmsExtractType,
        permitServiceCodes,
        this.logger,
      );
      this.upload(fileName);
      deleteLocalFile(fileName)
    }
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
      return this.updateOldFileRecord(oldFile);
    } else {
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
      toDate: getToDateForGarms(),
    });
    return {
      fileId: updatedOldRecord.fileId,
      fromTimestamp: updatedOldRecord.fromTimestamp,
      toTimestamp: updatedOldRecord.toTimestamp,
    };
  }

  private async createNewFileRecord(garmsExtractType: GarmsExtractType) {
    const latestFile = await this.getLatestFile(garmsExtractType);
    if (latestFile) {
      const newFile = new GarmsExtractFile();
      newFile.fromTimestamp = latestFile.toTimestamp;
      newFile.toTimestamp = getToDateForGarms();
      newFile.garmsExtractType = garmsExtractType;

      const savedFile = await this.garmsExtractFileRepository.save(newFile);
      return {
        fileId: savedFile.fileId,
        fromTimestamp: savedFile.fromTimestamp,
        toTimestamp: savedFile.toTimestamp,
      };
    }
  }

  private async getLatestFile(garmsExtractType: GarmsExtractType) {
    const [latestFile] = await this.garmsExtractFileRepository.find({
      where: { garmsExtractType: garmsExtractType },
      order: { toTimestamp: 'DESC' },
      take: 1,
    });
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
  
  private async getPermitTypeServiceCodes(): Promise<Map<string, number>> {
    const permitTypes = await this.permitTypeRepository.find();
    const permitTypeServiceCodes = new Map<string, number>();
    permitTypes.forEach((permitType) => {
      permitTypeServiceCodes.set(
        permitType.permitTypeId,
        Number(permitType.serviceCode),
      );
    });
    return permitTypeServiceCodes;
  }

  upload(fileName: string) {
    const options: FTPS.FTPOptions = {
      host: process.env.GARMS_HOST,
      username: process.env.GARMS_USER,
      password: process.env.GARMS_PWD,
      // additinal settings for lftp command.
      additionalLftpCommands:
        'set cache:enable no;set ftp:passive-mode on;set ftp:use-size no;set ftp:ssl-protect-data yes;set ftp:ssl-force yes;set ftps:initial-prot "P";set net:connection-limit 1;set net:max-retries 1;debug 3;', // Additional commands to pass to lftp, splitted by ';'
    };
    const ftps: FTPS = new FTPS(options);
    try {
      const remoteFilePath = 'GARMD.GA4701.WS.BATCH(+1)';
      const localFilePath = fileName;
      ftps.raw('quote SITE LRecl=140');
      ftps.pwd().exec(console.log);
      ftps.raw(`put -a ${localFilePath} -o "'${remoteFilePath}'"`);
      ftps.pwd().exec(console.log);
    } catch (e) {
      throw new InternalServerErrorException(e);
    } finally {
      ftps.raw('quit');
    }
  }
}
