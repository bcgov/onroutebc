import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { DocumentService } from './document.service';
import { LogAsyncMethodExecution } from '@common/decorator/log-async-method-execution.decorator';
import { v4 as uuidv4 } from 'uuid';
import { Document } from './entities/document.entity';
import { getAccessToken } from '@common/helper/gov-common-services.helper';
import { GovCommonServices } from '@common/enum/gov-common-services.enum';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { lastValueFrom, map } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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
      s3DocumentKey: (folder ? folder + '/' : '') + fileName,
      s3Object: s3Object,
      fileName: fileName,
      objectMimeType: contentType,
      dmsVersionId: latestDocument?.dmsVersionId
        ? latestDocument.dmsVersionId + 1
        : 1,
    });

    return document;
  }

  @LogAsyncMethodExecution()
  async orbcPostApi(url: string, body: unknown): Promise<void> {
    try {
      const token = await getAccessToken(
        GovCommonServices.ORBC_SERVICE_ACCOUNT,
        this.httpService,
        this.cacheManager,
      );

      const reqConfig: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      await lastValueFrom(
        this.httpService
          .post(url, body, reqConfig)
          .pipe(map((response) => response.data as JSON)),
      );
    } catch (error) {
      this.logger.error(`Error in calling ${url}: ${String(error)}`);
      throw new InternalServerErrorException(`Unable to call API ${url}.`);
    }
  }
}
