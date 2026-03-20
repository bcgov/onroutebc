import { Inject, Injectable, Logger } from '@nestjs/common';
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
  createGarmsCreditFile,
} from 'src/common/helper/garms.helper';
import {
  GARMS_CASH_FILE_LOCATION,
  GARMS_CASH_FILE_LRECL,
  GARMS_LOCAL_FILE_PATH,
  GARMS_CREDIT_FILE_LOCATION,
  GARMS_CREDIT_FILE_LRECL,
} from 'src/common/constants/garms.constant';
import { Cron } from '@nestjs/schedule';
import { getToDateForGarms } from 'src/common/helper/date-time.helper';
import { Nullable } from 'src/common/types/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { getFromCache } from '../../common/helper/cache.helper';
import { FeatureFlagValue } from '../../common/enum/feature-flag-value.enum';
import { CacheKey } from '../../common/enum/cache-key.enum';
import { execSync } from 'child_process';
import { uploadToGarms } from '../../common/helper/sftp.helper';

@Injectable()
export class GarmsService {
  private readonly logger = new Logger(GarmsService.name);
  constructor(
    @InjectRepository(GarmsExtractFile)
    private readonly garmsExtractFileRepository: Repository<GarmsExtractFile>,
    @InjectRepository(GarmsFileTransaction)
    private readonly fileTransactionRepository: Repository<GarmsFileTransaction>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(PermitType)
    private readonly permitTypeRepository: Repository<PermitType>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  @Cron(`${process.env.GARMS_CASH_FILE_INTERVAL || '0 */30 * * * *'}`)
  async processCashTransactions() {
    const garmsCashFeatureFlag = (await getFromCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
      'GARMS_CASH_CRON_JOB',
    )) as FeatureFlagValue;
    if (garmsCashFeatureFlag !== FeatureFlagValue.ENABLED) {
      this.logger.log('GARMS_CASH_CRON_JOB is DISABLED');
      return false;
    }
    const garmsExtractType = GarmsExtractType.CASH;
    const toTimestamp = getToDateForGarms();
    const oldFile = await this.getOldFile(garmsExtractType, toTimestamp);
    if (oldFile) {
      const { fileId, fromTimestamp } = oldFile;
      oldFile.toTimestamp = toTimestamp;
      // Fetch transactions based on the provided timestamps
      const transactions = await this.getTransactionWithPermitDetails(
        fromTimestamp,
        toTimestamp,
        garmsExtractType,
      );
      if (transactions?.length) {
        const permitServiceCodes = await this.getPermitTypeServiceCodes();
        const fileName = createGarmsCashFile(
          transactions,
          garmsExtractType,
          permitServiceCodes,
          this.logger,
        );

        const remoteFilePath = process.env.GARMS_ENV + GARMS_CASH_FILE_LOCATION;
        const recordLength = GARMS_CASH_FILE_LRECL;
        this.logger.log(`Sending cash file ${fileName}`);
        await this.uploadFile(fileName, remoteFilePath, recordLength);
      } else {
        this.logger.log('No data to process for GARMS cash file');
      }
      await this.updateFileSubmitTimestamp(oldFile);
      await this.saveTransactionIds(transactions, fileId);
    } else {
      this.logger.log('No record to process for GARMS cash file');
    }
  }

  @Cron(`${process.env.GARMS_CREDIT_FILE_INTERVAL || '0 */30 * * * *'}`)
  async processCreditTransactions() {
    const garmsCashFeatureFlag = (await getFromCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
      'GARMS_CREDIT_CRON_JOB',
    )) as FeatureFlagValue;
    if (garmsCashFeatureFlag !== FeatureFlagValue.ENABLED) {
      this.logger.log('GARMS_CREDIT_CRON_JOB is DISABLED');
      return false;
    }
    const garmsExtractType = GarmsExtractType.CREDIT;
    const toTimestamp = getToDateForGarms();
    const oldFile = await this.getOldFile(garmsExtractType, toTimestamp);
    if (oldFile) {
      const { fileId, fromTimestamp } = oldFile;
      oldFile.toTimestamp = toTimestamp;
      // Fetch transactions based on the provided timestamps
      const transactions = await this.getTransactionWithPermitDetails(
        fromTimestamp,
        toTimestamp,
        garmsExtractType,
      );
      if (transactions?.length) {
        const permitServiceCodes = await this.getPermitTypeServiceCodes();
        const fileName = createGarmsCreditFile(
          transactions,
          garmsExtractType,
          permitServiceCodes,
          this.logger,
        );

        const remoteFilePath =
          process.env.GARMS_ENV + GARMS_CREDIT_FILE_LOCATION;
        const recordLength = GARMS_CREDIT_FILE_LRECL;
        this.logger.log(`Sending credit file ${fileName}`);
        await this.uploadFile(fileName, remoteFilePath, recordLength);
      } else {
        this.logger.log('No data to process for GARMS credit file');
      }
      await this.updateFileSubmitTimestamp(oldFile);
      await this.saveTransactionIds(transactions, fileId);
    } else {
      this.logger.log('No record to process for GARMS credit file');
    }
  }

  /**
   * Save the file id and all its transaction ids
   * that has been sent to GARMS in ORBC_GARMS_FILE_TRANSACTION table
   * @param transactions
   * @param fileId
   */
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

  /**
   * After file is sent to GARMS successfuly.
   * And transactions of files are saved in databse.
   * Update file id with the submit timestamp
   * @param oldFile
   */
  private async updateFileSubmitTimestamp(oldFile: GarmsExtractFile) {
    // Update submit timestamp in garms file extract table
    await this.garmsExtractFileRepository.update(
      { fileId: oldFile.fileId },
      {
        fileSubmitTimestamp: new Date(),
        updatedDateTime: new Date(),
        updatedUser: 'dbo',
      },
    );
  }

  /**
   * check if unbsubmited record exists in GARMS
   * by checking if record with null submit timestamp exits
   * If exists then update the to timestamp, else create new record
   * with new "from" and "to" date range for onRouteBC financial transactions to be processed for garms.
   * @param garmsExtractType
   * @returns
   */
  private async getOldFile(
    garmsExtractType: GarmsExtractType,
    toTimestamp: Date,
  ) {
    const oldFile = await this.findUnsubmittedOldFile(garmsExtractType);

    if (oldFile) {
      return this.updateOldFileRecord(oldFile, toTimestamp);
    } else {
      return this.createNewFileRecord(garmsExtractType, toTimestamp);
    }
  }

  /**
   * find unsubmitted garms file record.
   */
  private async findUnsubmittedOldFile(
    transactionType: GarmsExtractType,
  ): Promise<Nullable<GarmsExtractFile>> {
    return this.garmsExtractFileRepository.findOne({
      where: {
        fileSubmitTimestamp: IsNull(),
        garmsExtractType: transactionType,
      },
    });
  }

  /**
   * find unsubmitted garms file record.
   */
  private async findOne(fileId: string): Promise<GarmsExtractFile | null> {
    return this.garmsExtractFileRepository.findOne({
      where: {
        fileId: fileId,
      },
    });
  }

  /**
   * Update "ToTimestamp" date range of an existing record.
   * @param oldFile
   * @returns
   */
  private async updateOldFileRecord(
    oldFile: GarmsExtractFile,
    toTimestamp: Date,
  ): Promise<GarmsExtractFile> {
    await this.garmsExtractFileRepository.update(
      { fileId: oldFile.fileId },
      {
        toTimestamp: toTimestamp,
        updatedDateTime: new Date(),
        updatedUser: 'dbo',
      },
    );
    return await this.findOne(oldFile.fileId);
  }
  /**
   * Create new record with new "from" and "to" date range
   * for onRouteBC financial transactions to be processed for garms
   * @param garmsExtractType
   * @returns
   */
  private async createNewFileRecord(
    garmsExtractType: GarmsExtractType,
    toTimestamp: Date,
  ): Promise<GarmsExtractFile> {
    const latestFile = await this.getLatestFile(garmsExtractType);
    if (latestFile) {
      const newFile = new GarmsExtractFile();
      newFile.fromTimestamp = latestFile.toTimestamp;
      newFile.toTimestamp = toTimestamp;
      newFile.fileSubmitTimestamp = null;
      newFile.garmsExtractType = garmsExtractType;
      const savedFile = await this.garmsExtractFileRepository.save(newFile);
      return savedFile;
    }
  }

  /**
   * Get most recent garms file id from OnRouteBC database.
   * @param garmsExtractType
   * @returns
   */
  private async getLatestFile(garmsExtractType: GarmsExtractType) {
    const [latestFile] = await this.garmsExtractFileRepository.find({
      where: { garmsExtractType: garmsExtractType },
      order: { toTimestamp: 'DESC' },
      take: 1,
    });
    return latestFile;
  }

  /**
   * Get onRouteBC financial transactions and permit details.
   * These details will be reported to GARMS.
   * More details are reported for garmsExtractType=CREDIT as compared to CASH
   *
   * @param fromTimestamp
   * @param toTimestamp
   * @param garmsExtractType
   * @returns
   */
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
      qb = qb.leftJoinAndSelect('permit.permitData', 'permitData');
      qb = qb.leftJoinAndSelect('permit.company', 'company');
      qb = qb.leftJoinAndSelect('company.creditAccount', 'creditaccount');
    }
    const result = await qb
      .andWhere('transaction.transactionApprovedDate >= :fromTimestamp', {
        fromTimestamp,
      })
      .andWhere('transaction.transactionApprovedDate < :toTimestamp', {
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

  /**
   * Get service codes from OnRouteBc
   * @returns
   */
  private async getPermitTypeServiceCodes(): Promise<Map<string, number>> {
    const permitTypes = await this.permitTypeRepository.find();
    const permitTypeServiceCodes = new Map<string, number>();
    permitTypes.forEach((permitType) => {
      permitTypeServiceCodes.set(
        permitType.permitTypeId,
        permitType.serviceCode,
      );
    });
    return permitTypeServiceCodes;
  }

  async uploadFile(
    fileName: string,
    remoteFilePath: string,
    recordLength: number,
  ) {
    try {
      await uploadToGarms(fileName, this.logger);
      this.executeSSHAndFTP(fileName, remoteFilePath, recordLength);
    } catch (error: unknown) {
      this.logger.error('Error uploading file:', error);
      throw error;
    }
  }

  executeSSHAndFTP(
    fileName: string,
    remoteFilePath: string,
    recordLength: number,
  ) {
    const user = process.env.GARMS_USER;
    const password = process.env.GARMS_PWD;
    const host = process.env.GARMS_HOST;
    const asciiFileName = fileName + 'ascii';
    let sshCommand;
    if (process.env.NODE_ENV === 'production') {
      sshCommand = `sshpass -p ${password} ssh -o "StrictHostKeyChecking no" ${user}@${host}`;
    } else {
      // disabling verbose for prod as it displays password
      sshCommand = `sshpass -p ${password} ssh -v -o "StrictHostKeyChecking no" ${user}@${host}`;
    }
    const iconvCommand = `iconv -f ISO8859-1 -t IBM-037 ${fileName} >> ${asciiFileName}`;
    const ftpCommands = `
    user ${user} ${password}
    ascii
    SITE BLKSIZE=0
    SITE LRECL=${recordLength}
    SITE WRAP
    SITE RECFM=FB
    put ${asciiFileName} '${remoteFilePath}'
    QUIT
    `;
    const changeTypeCommand = `${sshCommand} "${iconvCommand}"`;
    this.executeCommand(changeTypeCommand);
    const fullCommand = `${sshCommand} "echo \\"${ftpCommands}\\" | ftp -n -v ${host}"`;
    this.executeCommand(fullCommand);
    const deleteFilesCommand = `${sshCommand} "rm ${fileName} ${asciiFileName}"`;
    this.executeCommand(deleteFilesCommand);
    const deleteLocalFileCommand = `rm ${GARMS_LOCAL_FILE_PATH}${fileName}`;
    this.executeCommand(deleteLocalFileCommand);
  }

  private executeCommand(command: string) {
    try {
      const result = execSync(command, { encoding: 'utf-8' });
      this.logger.log(result);
      return result;
    } catch (error) {
      this.logger.error(`Execution Error: ${error}`);
      throw error;
    }
  }
}
