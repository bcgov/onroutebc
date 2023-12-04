import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  CompleteMultipartUploadCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3Service {
  constructor(private readonly httpService: HttpService) {}

  private readonly _s3AccessKeyId = process.env.DOPS_S3_ACCESSKEYID;
  private readonly _s3SecretAccessKey = process.env.DOPS_S3_SECRETACCESSKEY;
  private readonly _s3EndPoint = process.env.DOPS_S3_ENDPOINT;
  private readonly _s3Bucket = process.env.DOPS_S3_BUCKET;
  private readonly _s3Key = process.env.DOPS_S3_KEY;
  private readonly _s3PreSignedUrlExpiry =
    process.env.DOPS_S3_PRESIGNED_URL_EXPIRY;

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

  async uploadFile(
    file: Buffer,
    filePath?: string,
  ): Promise<CompleteMultipartUploadCommandOutput> {
    const client = this.s3Client;
    const upload = new Upload({
      client,
      params: {
        Bucket: this._s3Bucket,
        Key: this._s3Key + '/' + filePath,
        Body: file,
        ContentType: 'application/pdf',
        //TODO Add metadata
        //Metadata
      },
    });

    return await upload.done();
  }
}
