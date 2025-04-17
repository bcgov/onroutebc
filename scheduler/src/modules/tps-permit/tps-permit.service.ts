import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TpsPermit } from './entities/tps-permit.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3uploadStatus } from '../common/enum/s3-upload-status.enum';
import { S3Service } from './s3.service';
import { Document } from './entities/document.entity';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { Permit } from 'src/modules/common/entities/permit.entity';
import { v4 as uuidv4 } from 'uuid';
import { Cron } from '@nestjs/schedule';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';

@Injectable()
export class TpsPermitService {
  private readonly logger = new Logger(TpsPermitService.name);
  constructor(
    @InjectRepository(TpsPermit)
    private tpsPermitRepository: Repository<TpsPermit>,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * This method uploads PENDING TPS permits pdf to S3, update ORBC_DOCUMENT and
   * ORBC_PERMIT table. and delete migrated permit and pdf from TPS_MIGRATED_PERMIT table.
   */

  @Cron(`${process.env.TPS_PENDING_POLLING_INTERVAL || '0 */1 * * * *'}`)
  @LogAsyncMethodExecution()
  async uploadTpsPermit() {
    const tpsPermits: TpsPermit[] = await this.tpsPermitRepository.find({
      where: { s3UploadStatus: S3uploadStatus.Pending },
      select: { migrationId: true },
      take: parseInt(process.env.TPS_POLL_LIMIT),
    });
    const ids = tpsPermits.map((tpsPermit) => tpsPermit.migrationId);
    // create query builder fails if array is empty. hence the length check.
    if (ids.length > 0) {
      await this.tpsPermitRepository
        .createQueryBuilder()
        .update(TpsPermit)
        .set({
          s3UploadStatus: S3uploadStatus.Processing,
          lastUpdateTimestamp: new Date(),
          lastUpdateUser: 'dbo',
        })
        .where('migrationId IN (:...ids)', { ids: ids })
        .execute();
      await this.uploadToS3(ids);
    }
  }

  /**
   * This method processes errored out TPS permits pdf upload to S3, and after successfull processing
   * update ORBC_DOCUMENT and ORBC_PERMIT table, and delete migrated permit and pdf from TPS_MIGRATED_PERMIT table.
   */
  @Cron(`${process.env.TPS_ERROR_POLLING_INTERVAL || '0 0 */3 * * *'}`)
  @LogAsyncMethodExecution()
  async reprocessTpsPermit() {
    const tpsPermits: TpsPermit[] = await this.tpsPermitRepository.find({
      where: { s3UploadStatus: S3uploadStatus.Error, retryCount: LessThan(3) },
      select: { migrationId: true },
      take: parseInt(process.env.TPS_POLL_LIMIT),
    });

    const ids = tpsPermits.map((tpsPermit) => tpsPermit.migrationId);
    // create query builder fails if array is empty. hence the length check.
    if (ids.length > 0) {
      await this.tpsPermitRepository
        .createQueryBuilder()
        .update(TpsPermit)
        .set({
          s3UploadStatus: S3uploadStatus.Processing,
          lastUpdateTimestamp: new Date(),
          lastUpdateUser: 'dbo',
        })
        .where('migrationId IN (:...ids)', { ids: ids })
        .execute();
      await this.uploadToS3(ids);
    }
  }

  @LogAsyncMethodExecution()
  async createDocument(
    s3ObjectId: string,
    s3Object: CompleteMultipartUploadCommandOutput,
    tpsPermit: TpsPermit,
    companyId: number,
  ): Promise<Document> {
    const dmsVersionId = 1;
    const dmsRecord: Document = {
      documentId: undefined,
      s3ObjectId: s3ObjectId,
      s3VersionId: s3Object.VersionId,
      s3Location: s3Object.Location,
      objectMimeType: 'pdf',
      fileName: tpsPermit.newPermitNumber + '.pdf',
      dmsVersionId: dmsVersionId,
      companyId: companyId,
      createdDateTime: new Date(),
      createdUser: null,
      createdUserDirectory: null,
      createdUserGuid: null,
      updatedUser: null,
      updatedDateTime: new Date(),
      updatedUserGuid: null,
      updatedUserDirectory: null,
    };

    const result = await this.documentRepository.save(dmsRecord);
    return result;
  }

  @LogAsyncMethodExecution()
  async permitExists(permitNumber: string, revision: number) {
    return await this.permitRepository.findOne({
      where: {
        tpsPermitNumber: permitNumber,
        revision: revision - 1, //The revision number in the permit table is one less than the revision number in the tpsPermit table.
      },
    });
  }

  @LogAsyncMethodExecution()
  async uploadToS3(ids: number[]) {
    for (const id of ids) {
      const tpsPermit: TpsPermit = await this.tpsPermitRepository.findOne({
        where: { migrationId: id },
      });

      const permitExists = await this.permitExists(
        tpsPermit.permitNumber,
        tpsPermit.revision,
      );

      if (!permitExists) {
        await this.handlePermitNotExist(tpsPermit);
        continue;
      }

      if (permitExists.documentId) {
        await this.deleteTpsPermit(tpsPermit.migrationId);
        continue;
      }

      try {
        const s3ObjectId = uuidv4();
        const s3Object = await this.uploadToS3AndHandleErrors(
          tpsPermit,
          s3ObjectId,
        );

        const document = await this.createDocumentAndHandleErrors(
          s3ObjectId,
          s3Object,
          tpsPermit,
          permitExists.company.companyId,
        );

        await this.updatePermitWithDocumentId(tpsPermit, document.documentId);

        await this.deleteTpsPermit(tpsPermit.migrationId);
      } catch (error) {
        this.handleUploadError(tpsPermit, error);
      }
    }
  }

  @LogAsyncMethodExecution()
  async handlePermitNotExist(tpsPermit: TpsPermit) {
    await this.tpsPermitRepository.update(
      { migrationId: tpsPermit.migrationId },
      {
        s3UploadStatus: S3uploadStatus.Error,
        retryCount: tpsPermit.retryCount + 1,
        lastUpdateTimestamp: new Date(),
        lastUpdateUser: 'dbo',
      },
    );
  }

  @LogAsyncMethodExecution()
  async uploadToS3AndHandleErrors(tpsPermit: TpsPermit, s3ObjectId: string) {
    try {
      const s3Object = await this.s3Service.uploadFile(
        tpsPermit.pdf,
        tpsPermit.permitNumber + '.pdf',
        s3ObjectId,
      );
      this.logger.log(
        `${tpsPermit.permitNumber} uploaded successfully to ${s3Object.Location}`,
      );
      return s3Object;
    } catch (error) {
      this.logger.log(
        `Error while uploading permit# ${tpsPermit.permitNumber} docs to S3`,
      );
      this.logger.error(error);
      await this.tpsPermitRepository.update(
        { migrationId: tpsPermit.migrationId },
        {
          s3UploadStatus: S3uploadStatus.Error,
          retryCount: tpsPermit.retryCount + 1,
          lastUpdateTimestamp: new Date(),
          lastUpdateUser: 'dbo',
        },
      );
      throw new InternalServerErrorException(
        'S3 Upload Failed for TPS Permit Number ' + tpsPermit.permitNumber,
      );
    }
  }

  @LogAsyncMethodExecution()
  async createDocumentAndHandleErrors(
    s3ObjectId: string,
    s3Object: CompleteMultipartUploadCommandOutput,
    tpsPermit: TpsPermit,
    companyId: number,
  ) {
    try {
      const document = await this.createDocument(
        s3ObjectId,
        s3Object,
        tpsPermit,
        companyId,
      );
      return document;
    } catch (error) {
      this.logger.log(
        `Error while processing permit# ${tpsPermit.permitNumber}`,
      );
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error while processing permit# ${tpsPermit.permitNumber}`,
      );
    }
  }

  @LogAsyncMethodExecution()
  async updatePermitWithDocumentId(tpsPermit: TpsPermit, documentId: string) {
    await this.permitRepository.update(
      {
        tpsPermitNumber: tpsPermit.permitNumber,
        revision: tpsPermit.revision - 1,
      },
      {
        documentId: documentId,
        lastUpdateTimestamp: new Date(),
        lastUpdateUser: 'dbo',
      },
    );
  }

  @LogAsyncMethodExecution()
  async deleteTpsPermit(tpsPermitId: number) {
    await this.tpsPermitRepository.delete({
      migrationId: tpsPermitId,
    });
  }

  @LogAsyncMethodExecution()
  handleUploadError(tpsPermit: TpsPermit, error: unknown) {
    this.logger.log(`Error while processing permit# ${tpsPermit.permitNumber}`);
    this.logger.error(error);
  }

  /**
   * This method identifies stuck permits and verifies if their corresponding documents have been uploaded.
   * If a document already exists, the process takes no further action.
   * Otherwise, it attempts to upload the permit document again to S3 storage and updates the reference in the ORBC permit tables.
   */
  @Cron(`${process.env.TPS_MONITORING_POLLING_INTERVAL || '0 0 1 * * *'}`)
  @LogAsyncMethodExecution()
  async processTpsStuckRecords() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const stuckTpsPermits = await this.tpsPermitRepository
      .createQueryBuilder('tpsPermit')
      .where(`tpsPermit.s3UploadStatus = 'PROCESSING'`)
      .andWhere('tpsPermit.lastUpdateTimestamp <= :date', { date: yesterday })
      .getMany();

    if (stuckTpsPermits) {
      for (const permit of stuckTpsPermits) {
        const success = await this.checkDocumentIdInPermitTable(
          permit.permitNumber,
          permit.revision,
        );

        if (success) {
          await this.deleteTpsPermit(permit.migrationId);
        } else {
          await this.uploadToS3([permit.migrationId]);
        }
      }
    }
  }

  @LogAsyncMethodExecution()
  async checkDocumentIdInPermitTable(
    tpsPermitNumber: string,
    revision: number,
  ): Promise<boolean> {
    const permit = await this.permitExists(tpsPermitNumber, revision - 1);
    if (permit?.documentId) return true;
    else return false;
  }
}
