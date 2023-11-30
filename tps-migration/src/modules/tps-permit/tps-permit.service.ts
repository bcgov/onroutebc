import { Injectable } from '@nestjs/common';
import { TpsPermit } from './entities/tps-permit.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3uploadStatus } from '../common/enum/s3-upload-status.enum';
import { S3Service } from './s3.service';
import { v4 as uuidv4 } from 'uuid';
import { Document } from './entities/document.entity';
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { Permit } from './entities/permit.entity';

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

  
  async uploadTpsPermit() {
    console.log('inside uploadTpsPermit');
    const tpsPermits: TpsPermit[] = await this.tpsPermitRepository.find({
      where: { s3UploadStatus: S3uploadStatus.Pending },
      take: 200,
    });

    for (const tpsPermit of tpsPermits) {
      let s3Object = null;
      const s3ObjectId = uuidv4();
      try {
        s3Object = await this.s3Service.uploadFile(
          tpsPermit.pdf,
          s3ObjectId.toString(),
        );
      } catch (err) {
        console.log(err);
        await this.tpsPermitRepository.update({
          migrationId: tpsPermit.migrationId},{
          s3UploadStatus: S3uploadStatus.Error,
        });
      }
      const document = await this.createDocument(
        s3ObjectId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        s3Object,
        tpsPermit,
      );
      console.log(document.documentId);
     console.log(await this.permitRepository.update({
        permitNumber: tpsPermit.newPermitNumber},{
        documentId: document.documentId,
      }));

     console.log( await this.tpsPermitRepository.update({
        migrationId: tpsPermit.migrationId},{
        s3UploadStatus: S3uploadStatus.Processed,
      }));
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
      createdUser: 'redtruck',
      createdUserDirectory: 'BCEID',
      createdUserGuid: '06267945F2EB4E31B585932F78B76269',
      updatedUser: 'redtruck',
      updatedDateTime: new Date(),
      updatedUserGuid: '06267945F2EB4E31B585932F78B76269',
      updatedUserDirectory: 'BCEID',
    };

    const result = await this.documentRepository.save(dmsRecord);
    return result;
  }
}
