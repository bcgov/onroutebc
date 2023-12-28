import { Injectable, Logger } from '@nestjs/common';
import { TpsPermit } from './entities/tps-permit.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3uploadStatus } from '../common/enum/s3-upload-status.enum';
import { S3Service } from './s3.service';
import { Document } from './entities/document.entity';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { Permit } from './entities/permit.entity';
import {
  ERROR_POLLING_INTERVAL,
  LIMIT,
  PENDING_POLLING_INTERVAL,
} from '../common/constants/tps-migration.constant';
import { v4 as uuidv4 } from 'uuid';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TpsPermitService {
  constructor(
    @InjectRepository(TpsPermit)
    private tpsPermitRepository: Repository<TpsPermit>,
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private readonly s3Service: S3Service,
  ) {}

  private readonly logger = new Logger(TpsPermitService.name);

  /**
   * Scheduled method to run every 5 minute. To upload PENDING TPS permits pdf to S3, update ORBC_DOCUMENT and ORBC_PERMIT table. and delete migrated permit and pdf from TPS_MIGRATED_PERMIT table.
   * If records are stuck in PROCESSING status then something must have gone wrong and needs attention.
   *
   */
  @Cron(`0 */${PENDING_POLLING_INTERVAL} * * * *`)
  async uploadTpsPermit() {
    const tpsPermits: TpsPermit[] = await this.tpsPermitRepository.find({
      where: { s3UploadStatus: S3uploadStatus.Pending },
      take: LIMIT,
    });
    const ids = tpsPermits.map((tpsPermit) => tpsPermit.migrationId);
    // create query builder fails if array is empty. hence the length check.
    if (ids.length > 0) {
      await this.tpsPermitRepository
        .createQueryBuilder()
        .update(TpsPermit)
        .set({
          s3UploadStatus: S3uploadStatus.Processing,
        })
        .where('migrationId IN (:...ids)', { ids: ids })
        .execute();
      for (const tpsPermit of tpsPermits) {
        //Check to verify if permit document already exists in orbc permit table to avoid duplicate uploads.
        //Only proceed if permit exists in orbc permit table and it does not have a document id.
        const permit = await this.permitRepository.findOne({
          where: {
            tpsPermitNumber: tpsPermit.permitNumber,
            revision: tpsPermit.revision - 1,
          },
        });
        if (!permit) {
          await this.tpsPermitRepository.update(
            { migrationId: tpsPermit.migrationId },
            {
              s3UploadStatus: S3uploadStatus.Error,
              retryCount: tpsPermit.retryCount + 1,
            },
          );
          continue;
        }
        if (permit?.documentId) {
          await this.tpsPermitRepository.delete({
            migrationId: tpsPermit.migrationId,
          });
          continue;
        }
        let s3Object: CompleteMultipartUploadCommandOutput = null;
        const s3ObjectId = uuidv4();
        try {
          s3Object = await this.s3Service.uploadFile(
            tpsPermit.pdf,
            tpsPermit.permitNumber + '.pdf',
            s3ObjectId,
          );
        } catch (err) {
          this.logger.error('Error while upload to s3. ', err);
          this.logger.error('Failed permit numer ', tpsPermit.permitNumber);
          await this.tpsPermitRepository.update(
            {
              migrationId: tpsPermit.migrationId,
            },
            {
              s3UploadStatus: S3uploadStatus.Error,
              retryCount: tpsPermit.retryCount + 1,
            },
          );
        }
        this.logger.log(
          tpsPermit.permitNumber + ' uploaded successfully.',
          s3Object.Location,
        );
        if (s3Object) {
          const document = await this.createDocument(
            s3ObjectId,
            s3Object,
            tpsPermit,
          );
          await this.permitRepository.update(
            {
              tpsPermitNumber: tpsPermit.permitNumber,
              revision: tpsPermit.revision,
            },
            {
              documentId: document.documentId,
            },
          );

          await this.tpsPermitRepository.delete({
            migrationId: tpsPermit.migrationId,
          });
        }
      }
    }
  }

  /**
   * Scheduled method to run every 5 minute. To upload ERROR TPS permits pdf to S3, update ORBC_DOCUMENT and ORBC_PERMIT table. and delete migrated permit and pdf from TPS_MIGRATED_PERMIT table.
   * If records are stuck in PROCESSING status then something must have gone wrong and needs attention.
   *
   */
  @Cron(`0 0 */${ERROR_POLLING_INTERVAL} * * *`)
  async reprocessTpsPermit() {
    const tpsPermits: TpsPermit[] = await this.tpsPermitRepository.find({
      where: { s3UploadStatus: S3uploadStatus.Error, retryCount: LessThan(3) },
      take: LIMIT,
    });

    const ids = tpsPermits.map((tpsPermit) => tpsPermit.migrationId);
    // create query builder fails if array is empty. hence the length check.
    if (ids.length > 0) {
      await this.tpsPermitRepository
        .createQueryBuilder()
        .update(TpsPermit)
        .set({
          s3UploadStatus: S3uploadStatus.Processing,
        })
        .where('migrationId IN (:...ids)', { ids: ids })
        .execute();
      for (const tpsPermit of tpsPermits) {
        //Check to verify if permit document already exists in orbc permit table to avoid duplicate uploads.
        //Only proceed if permit exists in orbc permit table and it does not have a document id.
        const permit = await this.permitRepository.findOne({
          where: {
            tpsPermitNumber: tpsPermit.permitNumber,
            revision: tpsPermit.revision - 1,
          },
        });
        if (!permit) {
          await this.tpsPermitRepository.update(
            { migrationId: tpsPermit.migrationId },
            {
              s3UploadStatus: S3uploadStatus.Error,
              retryCount: tpsPermit.retryCount + 1,
            },
          );
          continue;
        }
        if (permit?.documentId) {
          await this.tpsPermitRepository.delete({
            migrationId: tpsPermit.migrationId,
          });
          continue;
        }
        let s3Object: CompleteMultipartUploadCommandOutput = null;
        const s3ObjectId = uuidv4();
        try {
          s3Object = await this.s3Service.uploadFile(
            tpsPermit.pdf,
            tpsPermit.permitNumber + '.pdf',
            s3ObjectId,
          );
        } catch (err) {
          this.logger.error('Error while upload to s3. ', err);
          this.logger.error('Failed permit numer ', tpsPermit.permitNumber);
          await this.tpsPermitRepository.update(
            {
              migrationId: tpsPermit.migrationId,
            },
            {
              s3UploadStatus: S3uploadStatus.Error,
              retryCount: tpsPermit.retryCount + 1,
            },
          );
        }
        this.logger.log(
          tpsPermit.permitNumber + ' uploaded successfully.',
          s3Object.Location,
        );
        if (s3Object) {
          const document = await this.createDocument(
            s3ObjectId,
            s3Object,
            tpsPermit,
          );
          await this.permitRepository.update(
            {
              tpsPermitNumber: tpsPermit.permitNumber,
              revision: tpsPermit.revision,
            },
            {
              documentId: document.documentId,
            },
          );

          await this.tpsPermitRepository.delete({
            migrationId: tpsPermit.migrationId,
          });
        }
      }
    }
  }

  async createDocument(
    s3ObjectId: string,
    s3Object: CompleteMultipartUploadCommandOutput,
    tpsPermit: TpsPermit,
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
      companyId: tpsPermit.migrationId,
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
}
