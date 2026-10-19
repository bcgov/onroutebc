import { Inject, Injectable, Logger } from '@nestjs/common';
import Client from 'ssh2-sftp-client';
import {
  connectToSftp,
  deleteFromRemote,
  downloadFromRemote,
  getPbiSFTPConnectionInfo,
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
import { PBIFile } from './entities/pbi-file.entity';
import { DocumentService } from '@modules/common/document.service';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '@modules/common/entities/document.entity';
import { describeError } from '@common/helper/error.helper';
import {
  mapToPrepaidAccountDetail,
  parsePbiPaymentDetailRecord,
} from '@common/helper/pbi.helper';
import { readStreamToString } from '@common/helper/file.helper';
import { PbiPaymentDetailRecord } from '@common/interface/pbi-payment-detail-record.interface';
import { PrepaidAccountDeposit } from './entities/prepaid-account-deposit.entity';
import { getQueryRunner } from '@common/helper/database.helper';

@Injectable()
export class PbiService {
  private readonly logger = new Logger(PbiService.name);
  constructor(
    private readonly s3Service: S3Service,
    private readonly dataSource: DataSource,
    private readonly documentService: DocumentService,
    @InjectRepository(PBIFile)
    private readonly pbiFileRepository: Repository<PBIFile>,
    @InjectRepository(PrepaidAccountDeposit)
    private readonly prepaidAccountDepositRepository: Repository<PrepaidAccountDeposit>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Cron(`${process.env.PBI_FILE_CRONT_TIME_PCT || '0 */1 * * * *'}`, {
    name: 'PbiFilesCronJob',
    timeZone: TIMEZONE_PACIFIC,
    waitForCompletion: true,
  })
  @LogAsyncMethodExecution()
  async pbiFilesCronJob() {
    this.logger.log('PBI Cron Job started at: ', new Date().toISOString());
    // Check if this scheduler should run on the current cluster
    if (!shouldRunOnCluster(this.logger, 'PBI Cron Job')) {
      return false;
    }

    const pbiCronJobFeatureFlag = (await getFromCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
      'PBI-CRON-JOB',
    )) as FeatureFlagValue;
    if (pbiCronJobFeatureFlag !== FeatureFlagValue.ENABLED) {
      this.logger.log('PBI-CRON-JOB is DISABLED');
      return false;
    }
    try {
      await this.connectAndDownlodFilesFromSFTP();

      await this.processDownloadedFiles();
    } catch (error) {
      const { message, stack } = describeError(error);
      this.logger.error(`PBI file cron job failure : ${message}`, stack);
    }
  }

  private async connectAndDownlodFilesFromSFTP() {
    let sftp: Client;
    try {
      sftp = await connectToSftp(this.logger, getPbiSFTPConnectionInfo());
      const files = await listFiles(
        this.logger,
        sftp,
        process.env.PBI_REMOTE_PATH,
      );

      // Process files sequentially to avoid overlapping operations on the SFTP connection.
      await files.reduce(
        (previousFile, file) =>
          previousFile.then(() => this.downloadFile(sftp, file)),
        Promise.resolve(),
      );
    } catch (error) {
      const { message, stack } = describeError(error);
      this.logger.error(`PBI file cron job failed: ${message}`, stack);
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
      const fileRecordExists = await this.pbiFileRepository.existsBy({
        fileName: file.name,
        documentId: Not(IsNull()),
      });
      if (fileRecordExists) {
        this.logger.log(
          `Skipping PBI file "${file.name}" because it already exists in ORBC_PBI_FILE and S3.`,
        );
        //TODO Uncomment deleteFromRemote after testing
        //await deleteFromRemote(this.logger, sftp, process.env.PBI_REMOTE_PATH, file);
        return;
      }

      const fileData = await downloadFromRemote(
        this.logger,
        sftp,
        process.env.PBI_REMOTE_PATH,
        file,
      );

      this.logger.log(`Successfully downloaded file ${file.name} via SFTP.`);

      const document = await this.uploadToS3andCreateDocument({
        fileName: file.name,
        fileData: fileData,
      });

      this.logger.log(`Successfully uploaded file ${file.name} to S3.`);

      await this.pbiFileRepository.save({
        fileName: file.name,
        documentId: document.documentId,
        downloadTimestamp: new Date(),
        isProcessed: false,
      });

      this.logger.log(
        `Successfully saved the ${file.name} in ORBC and is ready for processing.`,
      );

      //TODO Uncomment deleteFromRemote after testing
      //await deleteFromRemote(this.logger, sftp, process.env.PBI_REMOTE_PATH, file);
    } catch (error) {
      const { message, stack } = describeError(error);
      this.logger.error(
        `Failed to download PBI file ${file.name} : ${message}`,
        stack,
      );
    }
  }

  private async uploadToS3andCreateDocument({
    fileName,
    fileData,
  }: {
    fileName: string;
    fileData: Buffer<ArrayBufferLike>;
  }): Promise<Document> {
    const s3Object = await this.s3Service.uploadFile(
      fileData,
      fileName,
      'text/plain',
      process.env.PBI_S3_PATH + '/' + fileName,
    );

    const latestDocument = await this.documentService.findLatest(fileName);

    const document = await this.documentService.createDocument({
      s3ObjectId: latestDocument?.s3ObjectId || uuidv4(),
      s3Object: s3Object,
      fileName: fileName,
      objectMimeType: 'text/plain',
      dmsVersionId: latestDocument?.dmsVersionId
        ? latestDocument.dmsVersionId + 1
        : 1,
    });

    return document;
  }

  @LogAsyncMethodExecution()
  async processDownloadedFiles(): Promise<void> {
    const files = await this.pbiFileRepository.find({
      where: { isProcessed: false },
      order: { id: 'ASC' },
    });

    await files.reduce(
      (previousFile, file) =>
        previousFile.then(() => this.processDownloadedFile(file)),
      Promise.resolve(),
    );
  }

  private async processDownloadedFile(file: PBIFile): Promise<void> {
    try {
      const document = await this.documentService.findByDocumentId(
        file.documentId,
      );

      const contents = await this.s3Service.getFile(
        process.env.PBI_S3_PATH + '/' + document?.fileName,
        document.s3VersionId,
      );

      const fileContents = await readStreamToString(contents);
      const lines = fileContents.split(/\r?\n/);
      const paymentDetailRecords: PbiPaymentDetailRecord[] = [];
      for (const line of lines) {
        if (!line.startsWith('G')) {
          continue;
        }

        paymentDetailRecords.push(parsePbiPaymentDetailRecord(line));
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
          PBIFile,
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
        `Failed to process PBI file ${file.fileName} : ${message}`,
        stack,
      );
    }
  }
}
