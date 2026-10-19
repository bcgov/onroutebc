import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogAsyncMethodExecution } from '@common/decorator/log-async-method-execution.decorator';
import { Document } from './entities/document.entity';
import { Nullable } from '@common/types/common';
@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  @LogAsyncMethodExecution()
  async findLatest(fileName: string): Promise<Document> {
    const subQuery = this.documentRepository
      .createQueryBuilder('document')
      .select('document.s3ObjectId')
      .where('document.fileName = :fileName')
      .getQuery();

    const latestDmsObject = await this.documentRepository
      .createQueryBuilder('document')
      .where(`document.s3ObjectId IN (${subQuery})`, { fileName: fileName })
      .orderBy('document.dmsVersionId', 'DESC')
      .getOne();

    return latestDmsObject;
  }

  async findByDocumentId(documentId: string): Promise<Document> {
    const document = await this.documentRepository.findOneBy({ documentId });
    if (!document) {
      throw new Error(`Document ${documentId} was not found.`);
    }
    return document;
  }

  @LogAsyncMethodExecution()
  async createDocument({
    s3ObjectId,
    s3Object,
    fileName,
    objectMimeType,
    dmsVersionId = 1,
    companyId,
  }: {
    s3ObjectId: string;
    s3Object: CompleteMultipartUploadCommandOutput;
    fileName: string;
    objectMimeType: string;
    dmsVersionId?: Nullable<number>;
    companyId?: Nullable<number>;
  }): Promise<Document> {
    try {
      const dmsRecord: Document = {
        documentId: undefined,
        s3ObjectId: s3ObjectId,
        s3VersionId: s3Object.VersionId,
        s3Location: s3Object.Location,
        objectMimeType: objectMimeType,
        fileName: fileName,
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
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
