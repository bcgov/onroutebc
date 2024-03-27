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
import { Permit } from './entities/permit.entity';
import { v4 as uuidv4 } from 'uuid';
import { Cron } from '@nestjs/schedule';
import { LogAsyncMethodExecution } from '../../decorator/log-async-method-execution.decorator';

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
   * To upload PENDING TPS permits pdf to S3, update ORBC_DOCUMENT and
   * ORBC_PERMIT table. and delete migrated permit and pdf from
   * TPS_MIGRATED_PERMIT table. If records are stuck in PROCESSING status then
   * something must have gone wrong and needs attention.
   *
   */

  @Cron(`${process.env.TPS_PENDING_POLLING_INTERVAL || "0 */1 * * * *"}`)
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
        })
        .where('migrationId IN (:...ids)', { ids: ids })
        .execute();
      await this.uploadToS3(ids);
    }
  }

  /**
   * To upload ERROR TPS permits pdf to S3, update ORBC_DOCUMENT and ORBC_PERMIT
   * table, and delete migrated permit and pdf from TPS_MIGRATED_PERMIT table.
   * If records are stuck in PROCESSING status then something must have gone
   * wrong and needs attention.
   *
   */
  @Cron(`${process.env.TPS_ERROR_POLLING_INTERVAL || "0 0 */3 * * *"}`)
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
        revision: revision - 1,
      },
    });
  }

  @LogAsyncMethodExecution()
  async uploadToS3(ids: number[]) {
    for (const id of ids) {
      const tpsPermit: TpsPermit = await this.tpsPermitRepository.findOne({
        where: { migrationId: id },
      });
      //Check to verify if permit document already exists in orbc permit table
      //to avoid duplicate uploads. Only proceed if permit exists in orbc permit
      //table and it does not have a document id.
      const permit = await this.permitExists(
        tpsPermit.permitNumber,
        tpsPermit.revision,
      );
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
      } catch (error) {
        this.logger.log(
          `Error while uploading permit# ${tpsPermit.permitNumber} docs to S3`,
        );
        this.logger.error(error);
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
        `${tpsPermit.permitNumber} uploaded successfully to ${s3Object.Location}`,
      );
      try {
        if (s3Object) {
          const document = await this.createDocument(
            s3ObjectId,
            s3Object,
            tpsPermit,
            permit.companyId,
          );
          await this.permitRepository.update(
            {
              tpsPermitNumber: tpsPermit.permitNumber,
              revision: tpsPermit.revision - 1,
            },
            {
              documentId: document.documentId,
            },
          );

          await this.tpsPermitRepository.delete({
            migrationId: tpsPermit.migrationId,
          });
        } else {
          throw new InternalServerErrorException(
            'S3 Upload Failed for TPS Permit Number ',
            permit.tpsPermitNumber,
          );
        }
      } catch (error) {
        this.logger.log(
          `Error while processing permit# ${tpsPermit.permitNumber}`,
        );
        this.logger.error(error);
      }
    }
  }
}
