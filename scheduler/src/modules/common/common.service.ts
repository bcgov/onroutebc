import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from './s3.service';
import { DocumentService } from './document.service';
import { LogAsyncMethodExecution } from '@common/decorator/log-async-method-execution.decorator';
import { v4 as uuidv4 } from 'uuid';
import { Document } from './entities/document.entity';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);
  constructor(
    private readonly s3Service: S3Service,
    private readonly documentService: DocumentService,
  ) {}

  @LogAsyncMethodExecution()
  async uploadToS3andCreateDocument({
    folder,
    fileName,
    fileData,
    contentType,
  }: {
    folder?: string;
    fileName: string;
    fileData: Buffer<ArrayBufferLike>;
    contentType: string;
  }): Promise<Document> {
    const s3Object = await this.s3Service.uploadFile(
      fileData,
      fileName,
      contentType,
      (folder ? folder + '/' : '') + fileName,
    );

    const latestDocument = await this.documentService.findLatest(fileName);

    const document = await this.documentService.createDocument({
      s3ObjectId: latestDocument?.s3ObjectId || uuidv4(),
      s3Object: s3Object,
      fileName: fileName,
      objectMimeType: contentType,
      dmsVersionId: latestDocument?.dmsVersionId
        ? latestDocument.dmsVersionId + 1
        : 1,
    });

    return document;
  }
}
