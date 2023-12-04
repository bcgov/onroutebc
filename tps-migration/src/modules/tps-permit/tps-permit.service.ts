import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { TpsPermit } from './entities/tps-permit.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3uploadStatus } from '../common/enum/s3-upload-status.enum';
import { S3Service } from './s3.service';
import { Document } from './entities/document.entity';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { Permit } from './entities/permit.entity';
import * as sha1 from 'crypto-js/sha1';
import { LIMIT } from '../common/constants/tps-migration.constant';
import { v5 as uuidv5 } from 'uuid';
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

  @Cron('0 */30 * * * *')
  async uploadTpsPermit() {
    const tpsPermits: TpsPermit[] = await this.tpsPermitRepository.find({
      where: { s3UploadStatus: S3uploadStatus.Pending },
      take: LIMIT,
    });

    const ids = tpsPermits.map((tpsPermit) => tpsPermit.migrationId);
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
        let s3Object: CompleteMultipartUploadCommandOutput = null;
        const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
        const hash = sha1(tpsPermit.pdf.toString());
        const s3ObjectId = uuidv5(hash.toString(), MY_NAMESPACE);
        try {
          s3Object = await this.s3Service.uploadFile(tpsPermit.pdf, s3ObjectId);
        } catch (err) {
          this.logger.error('Error while upload to s3. ', err);
          this.logger.error('Failed permit numer ', tpsPermit.permitNumber);
          await this.tpsPermitRepository.update(
            {
              migrationId: tpsPermit.migrationId,
            },
            {
              s3UploadStatus: S3uploadStatus.Error,
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
              permitNumber: tpsPermit.newPermitNumber,
            },
            {
              documentId: document.documentId,
            },
          );

          await this.tpsPermitRepository.update(
            {
              migrationId: tpsPermit.migrationId,
            },
            {
              s3UploadStatus: S3uploadStatus.Processed,
            },
          );
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
      createdUser: 'tps_migration',
      createdUserDirectory: 'BCEID',
      createdUserGuid: '79F2FC0B69EB4819A18DD68958390DE6',
      updatedUser: 'tps_migration',
      updatedDateTime: new Date(),
      updatedUserGuid: '79F2FC0B69EB4819A18DD68958390DE6',
      updatedUserDirectory: 'BCEID',
    };

    const result = await this.documentRepository.save(dmsRecord);
    return result;
  }
}
