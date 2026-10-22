import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  CompleteMultipartUploadCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { LogAsyncMethodExecution } from '@common/decorator/log-async-method-execution.decorator';
import { Response } from 'express';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  constructor(private readonly httpService: HttpService) {}

  private readonly _s3AccessKeyId = process.env.OCIO_S3_ACCESSKEYID;
  private readonly _s3SecretAccessKey = process.env.OCIO_S3_SECRETACCESSKEY;
  private readonly _s3EndPoint = process.env.OCIO_S3_ENDPOINT;
  private readonly _s3Bucket = process.env.OCIO_S3_BUCKET;
  private readonly _s3Key = process.env.OCIO_S3_KEY;
  private readonly _s3PreSignedUrlExpiry =
    process.env.OCIO_S3_PRESIGNED_URL_EXPIRY;

  private s3Client: S3Client = new S3Client({
    apiVersion: '2006-03-01',
    credentials: {
      accessKeyId: this._s3AccessKeyId,
      secretAccessKey: this._s3SecretAccessKey,
    },
    endpoint: this._s3EndPoint,
    forcePathStyle: true,
    region: 'ca-central-1',
  });
  @LogAsyncMethodExecution()
  async uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string,
    filePath?: string,
  ): Promise<CompleteMultipartUploadCommandOutput> {
    const client = this.s3Client;
    const upload = new Upload({
      client,
      params: {
        Bucket: this._s3Bucket,
        Key: this._s3Key + '/' + filePath,
        Body: file,
        ContentType: contentType,
        ContentDisposition: 'attachment; filename="' + fileName + '"',
        //TODO Add metadata
        //Metadata
      },
    });
    return await upload.done();
  }

  @LogAsyncMethodExecution()
  async getFile(
    filePath: string,
    versionId?: string,
    res?: Response,
  ): Promise<NodeJS.ReadableStream> {
    const params = {
      Bucket: this._s3Bucket,
      Key: this._s3Key + '/' + filePath,
      versionId: versionId || undefined, // Optional: Specify the version ID if you want to retrieve a specific version of the object
    };

    try {
      const response = await this.s3Client.send(new GetObjectCommand(params));
      if (res) this._processS3Headers(response, res);
      const stream = response.Body as NodeJS.ReadableStream;
      return stream;
    } catch (error) {
      this.logger.error(error);
    }
  }

  private _processS3Headers(
    s3Resp: GetObjectCommandOutput,
    res: Response,
  ): string[] {
    const exposedHeaders: string[] = [];
    if (s3Resp.ContentLength)
      res.set('Content-Length', s3Resp.ContentLength.toString());
    if (s3Resp.ContentType) res.set('Content-Type', s3Resp.ContentType);
    if (s3Resp.ETag) {
      const etag = 'ETag';
      res.set(etag, s3Resp.ETag);
      exposedHeaders.push(etag);
    }
    if (s3Resp.LastModified)
      res.set('Last-Modified', s3Resp.LastModified.toUTCString());
    if (s3Resp.Metadata) {
      Object.entries(s3Resp.Metadata).forEach(([key, value]) => {
        const metadata = `x-amz-meta-${key}`;
        res.set(metadata, value);
        exposedHeaders.push(metadata);
      });
    }
    if (s3Resp.ServerSideEncryption) {
      const sse = 'x-amz-server-side-encryption';
      res.set(sse, s3Resp.ServerSideEncryption);
      exposedHeaders.push(sse);
    }
    if (s3Resp.VersionId) {
      const s3VersionId = 'x-amz-version-id';
      res.set(s3VersionId, s3Resp.VersionId);
      exposedHeaders.push(s3VersionId);
    }

    return exposedHeaders;
  }
}
