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
import { createGarmsCashFile } from 'src/common/helper/garms.helper';
import {
  GARMS_CASH_FILE_LOCATION,
  GARMS_CASH_FILE_LRECL,
} from 'src/common/constants/garms.constant';
import { Cron } from '@nestjs/schedule';
import { getToDateForGarms } from 'src/common/helper/date-time.helper';
import { Nullable } from 'src/common/types/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

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
  ) {}
  @Cron(`${process.env.GARMS_CASH_FILE_INTERVAL || '0 */30 * * * *'}`)
  async processCashTransactions() {
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
        await this.updateFileSubmitTimestamp(oldFile);
        await this.saveTransactionIds(transactions, fileId);
        await this.uploadFile(fileName, remoteFilePath, recordLength);
      } else {
        this.logger.log('No data to process for GARMS cash file');
      }
    } else {
      this.logger.log('No record to process for GARMS cash file');
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
  /**
   * upload file to GARMS mainframe.
   * @param fileName
   * @param recordLength
   * @param remoteFilePath
   */
  async upload(fileName: string, recordLength: number, remoteFilePath: string) {
    const username = process.env.GARMS_USER;
    const password = process.env.GARMS_PWD;
    if (username && password) {
      const localFilePath = fileName; // Unique temp file name
      const options: FTPS.FTPOptions = {
        host: process.env.GARMS_HOST,
        username: process.env.GARMS_USER,
        password: process.env.GARMS_PWD,
        // additinal settings for lftp command. passive-mode is only on for onRoute because pf firewall, it is off for TPS.
        additionalLftpCommands: `set cache:enable no;set ftp:passive-mode on;set ftp:use-size no;set ftp:ssl-protect-data yes;set ftp:ssl-force yes;set ftp:ssl-auth TLS;set ssl:verify-certificate no;set ftps:initial-prot "P";set net:connection-limit 1;set net:max-retries 1;debug 5;`,
      };
      const ftps: FTPS = new FTPS(options);

      // site command is to set record length to 140 for remote server. put -a is for ascii mode, -e to delete source file after successful transfer -o for remote file name.
      const ftpCommand = `SITE LRecl=${recordLength}; put -aE ${localFilePath}  -o "'${remoteFilePath}'"`;

      // Wrap the FTPS command inside a Promise
      const uploadPromise = new Promise(() => {
        this.logger.log('sending file to garms', localFilePath);
        // site command is to set record length to 140 for remote server. put -a is for ascii mode, -e to delete source file after successful transfer -o for remote file name.
        const ftpCommand = `SITE LRecl=${recordLength}; put -aE ${localFilePath}  -o "'${remoteFilePath}'"`;
        ftps.raw(ftpCommand).exec(console.log);
      });
      // Wait for the upload to complete before proceeding
      await uploadPromise;
    } else {
      this.logger.log('Unable to get username and password for ftp server');
    }
  }

  // This function will run the shell script for file upload with parameters
  async uploadFile(
    sourceFile: string,
    destinationFile: string,
    recordLength: number,
  ): Promise<string> {
    try {
      const execPromise = promisify(exec);
      const host = process.env.GARMS_HOST;
      const username = process.env.GARMS_USER;
      const password = process.env.GARMS_PWD;
      const scriptPath = path.resolve(__dirname, '../../../../tmp/upload-file.helper.sh')
      const lftpCommand = `
      lftp 
      set cache:enable no
      set ftp:passive-mode on
      set ftp:use-size no
      set ftp:ssl-protect-data true
      set ftp:ssl-force true
      set ftp:ssl-auth TLS
      set ssl:verify-certificate no
      set ftps:initial-prot "P"
      set net:connection-limit 1
      set net:max-retries 1
      debug 5

      open "${host}"
      user "${username}" "${password}"

      quote SITE LRecl="${recordLength}"
      put -a "${sourceFile}" -o "'${destinationFile}'"
    `;
      // Running the shell script using execPromise with source and destination as parameters
      const { stdout, stderr } = await execPromise(lftpCommand);

      if (stderr) {
        console.error('Error executing shell script:', stderr);
        throw new Error(stderr);
      }

      console.log('Shell script output:', stdout);
      return stdout; // Return the output from the shell script
    } catch (error) {
      console.error('Error in file upload process:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}
