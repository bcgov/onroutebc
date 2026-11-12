import { Inject, Injectable, Logger } from '@nestjs/common';
import Client from 'ssh2-sftp-client';
import {
  connectToSftp,
  deleteFromRemote,
  downloadFromRemote,
  getBpiSFTPConnectionInfo,
  listFiles,
} from '@common/helper/sftp.helper';
import { S3Service } from '@modules/common/s3.service';
import { LogAsyncMethodExecution } from '@common/decorator/log-async-method-execution.decorator';
import { Cron } from '@nestjs/schedule';
import { TIMEZONE_PACIFIC } from '@common/constants/api.constant';
import { getFromCache } from '@common/helper/cache.helper';
import { FeatureFlagValue } from '@common/enum/feature-flag-value.enum';
import { CacheKey } from '@common/enum/cache-key.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { shouldRunOnCluster } from '@common/helper/cron.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { BPIFile } from './entities/bpi-file.entity';
import { DocumentService } from '@modules/common/document.service';
import { describeError } from '@common/helper/error.helper';
import {
  mapToPrepaidAccountDetail,
  parseBpiPaymentDetailRecord,
} from '@common/helper/bpi.helper';
import { readStreamToString } from '@common/helper/file.helper';
import { BpiPaymentDetailRecord } from '@common/interface/bpi-payment-detail-record.interface';
import { PrepaidAccountDeposit } from './entities/prepaid-account-deposit.entity';
import { getQueryRunner } from '@common/helper/database.helper';
import { NotificationTemplate } from '@common/enum/notification-template.enum';
import { NotificationDto } from '@modules/common/dto/request/notification.dto';
import { CommonService } from '@modules/common/common.service';

@Injectable()
export class BpiService {
  private readonly logger = new Logger(BpiService.name);
  constructor(
    private readonly s3Service: S3Service,
    private readonly commonService: CommonService,
    private readonly dataSource: DataSource,
    private readonly documentService: DocumentService,
    @InjectRepository(BPIFile)
    private readonly bpiFileRepository: Repository<BPIFile>,
    @InjectRepository(PrepaidAccountDeposit)
    private readonly prepaidAccountDepositRepository: Repository<PrepaidAccountDeposit>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Cron(`${process.env.BPI_FILE_CRONT_TIME_PCT || '0 */30 * * * *'}`, {
    name: 'BpiFilesCronJob',
    timeZone: TIMEZONE_PACIFIC,
    waitForCompletion: true,
  })
  @LogAsyncMethodExecution()
  async bpiFilesCronJob() {
    this.logger.log(`BPI Cron Job started at: ${new Date().toISOString()}`);
    // Check if this scheduler should run on the current cluster
    if (!shouldRunOnCluster(this.logger, 'BPI Cron Job')) {
      return false;
    }

    const bpiCronJobFeatureFlag = (await getFromCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
      'BPI-CRON-JOB',
    )) as FeatureFlagValue;
    if (bpiCronJobFeatureFlag !== FeatureFlagValue.ENABLED) {
      this.logger.log('BPI-CRON-JOB is DISABLED');
      return false;
    }

    try {
      await this.connectAndDownlodFilesFromSFTP();
      await this.processDownloadedFiles();
      //Fire and forget
      void this.sendBpiCronNotification(
        NotificationTemplate.BPI_SUCCESS,
        'BPI Cron Job Success',
      );
      return true;
    } catch (error) {
      const { message, stack } = describeError(error);
      this.logger.error(`BPI file cron job failure : ${message}`, stack);
      //Fire and forget
      void this.sendBpiCronNotification(
        NotificationTemplate.BPI_FAILURE,
        'BPI Cron Job Failure',
      );
      return false;
    }
  }

  private async sendBpiCronNotification(
    templateName: NotificationTemplate,
    subject: string,
  ): Promise<void> {
    try {
      const notificationList =
        templateName === NotificationTemplate.BPI_SUCCESS
          ? process.env.BPI_SUCCESS_EMAIL_RECIPIENTS
          : process.env.BPI_FAILURE_EMAIL_RECIPIENTS;

      const recipients = notificationList
        ?.split(';')
        .map((recipient) => recipient.trim())
        .filter(Boolean);
      if (!recipients?.length) {
        throw new Error(
          `BPI notification list must contain at least one address.`,
        );
      }

      const dopsUrl = process.env.DOPS_URL;
      if (!dopsUrl) {
        throw new Error('DOPS_URL must be configured.');
      }

      const notification: NotificationDto = {
        subject,
        to: recipients,
        templateName,
        data: {},
      };
      await this.commonService.orbcPostApi(
        `${dopsUrl}/notification`,
        notification,
      );
    } catch (error) {
      //swallow the error and log it, we don't want to fail the cron job because of notification failure
      const { message, stack } = describeError(error);
      this.logger.error(
        `Failed to send BPI cron job notification : ${message}`,
        stack,
      );
    }
  }

  private async connectAndDownlodFilesFromSFTP() {
    let sftp: Client;
    try {
      sftp = await connectToSftp(this.logger, getBpiSFTPConnectionInfo());
      const files = await listFiles(
        this.logger,
        sftp,
        process.env.BPI_REMOTE_PATH,
      );

      // Process files sequentially to avoid overlapping operations on the SFTP connection.
      await files?.reduce(
        (previousFile, file) =>
          previousFile.then(() => this.downloadFile(sftp, file)),
        Promise.resolve(),
      );
    } catch (error) {
      const { message, stack } = describeError(error);
      this.logger.error(`BPI file cron job failed: ${message}`, stack);
      throw error;
    } finally {
      this.logger.log('Closing SFTP connection...');
      await sftp?.end();
    }
  }

  private async downloadFile(
    sftp: Client,
    file: Client.FileInfo,
  ): Promise<void> {
    try {
      const fileRecordExists = await this.bpiFileRepository.existsBy({
        fileName: file.name,
        documentId: Not(IsNull()),
      });
      if (fileRecordExists) {
        this.logger.log(
          `Skipping BPI file "${file.name}" because it already exists in ORBC_BPI_FILE and S3.`,
        );
        await deleteFromRemote(
          this.logger,
          sftp,
          process.env.BPI_REMOTE_PATH,
          file,
        );
        return;
      }

      const fileData = await downloadFromRemote(
        this.logger,
        sftp,
        process.env.BPI_REMOTE_PATH,
        file,
      );

      this.logger.log(`Successfully downloaded file ${file.name} via SFTP.`);

      const document = await this.commonService.uploadToS3andCreateDocument({
        folder: process.env.S3_BPI_SUBFOLDER_PATH,
        fileName: file.name,
        fileData: fileData,
        contentType: 'text/plain',
      });

      this.logger.log(`Successfully uploaded file ${file.name} to S3.`);

      await this.bpiFileRepository.save({
        fileName: file.name,
        documentId: document.documentId,
        downloadTimestamp: new Date(),
        isProcessed: false,
      });

      this.logger.log(
        `Successfully saved the ${file.name} in ORBC and is ready for processing.`,
      );

      await deleteFromRemote(
        this.logger,
        sftp,
        process.env.BPI_REMOTE_PATH,
        file,
      );
    } catch (error) {
      const { message, stack } = describeError(error);
      this.logger.error(
        `Failed to download BPI file ${file.name} : ${message}`,
        stack,
      );
      throw error;
    }
  }

  @LogAsyncMethodExecution()
  async processDownloadedFiles(): Promise<void> {
    const files = await this.bpiFileRepository.find({
      where: { isProcessed: false },
      order: { id: 'ASC' },
    });

    await files?.reduce(
      (previousFile, file) =>
        previousFile.then(() => this.processDownloadedFile(file)),
      Promise.resolve(),
    );
  }

  private async processDownloadedFile(file: BPIFile): Promise<void> {
    try {
      const document = await this.documentService.findByDocumentId(
        file.documentId,
      );

      const contents = await this.s3Service.getFile(
        document.s3DocumentKey,
        document.s3VersionId,
      );

      const fileContents = await readStreamToString(contents);
      const lines = fileContents.split(/\r?\n/);
      const paymentDetailRecords: BpiPaymentDetailRecord[] = [];
      for (const line of lines) {
        if (!line.startsWith('G')) {
          continue;
        }

        paymentDetailRecords.push(parseBpiPaymentDetailRecord(line));
      }

      const prepaidAccountDeposits = paymentDetailRecords.map((record) =>
        mapToPrepaidAccountDetail(record, file.id),
      );
      const { localQueryRunner, queryRunner } = await getQueryRunner({
        dataSource: this.dataSource,
      });
      try {
        await queryRunner.manager.save<PrepaidAccountDeposit[]>(
          prepaidAccountDeposits,
        );

        await queryRunner.manager.update(
          BPIFile,
          { id: file.id },
          {
            isProcessed: true,
            processedTimestamp: new Date(),
            createdDateTime: new Date(),
            updatedDateTime: new Date(),
          },
        );

        if (localQueryRunner) {
          await queryRunner.commitTransaction();
        }
      } catch (error) {
        if (localQueryRunner) {
          await queryRunner.rollbackTransaction();
        }
        this.logger.error(error);
        throw error;
      } finally {
        if (localQueryRunner) {
          await queryRunner.release();
        }
      }
    } catch (error) {
      const { message, stack } = describeError(error);
      this.logger.error(
        `Failed to process BPI file ${file.fileName} : ${message}`,
        stack,
      );
      throw error;
    }
  }

  @LogAsyncMethodExecution()
  async fetchRecordsForGarmsCreditFile(): Promise<BPIFile[]> {
    return this.bpiFileRepository
      .createQueryBuilder('bpiFile')
      .leftJoinAndSelect('bpiFile.prepaidAccountDeposits', 'deposit')
      .leftJoin('bpiFile.garmsFileTransactions', 'garmsFileTransaction')
      .where('bpiFile.isProcessed = :isProcessed', { isProcessed: 'Y' })
      .andWhere('garmsFileTransaction.id IS NULL')
      .orderBy('deposit.id', 'ASC')
      .getMany();
  }
}
