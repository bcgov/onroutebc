/**
 * Service responsible for interacting with S3 Object Store
 */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  CompleteMultipartUploadCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Response } from 'express';
import { IFile } from '../../interface/file.interface';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class S3Service {
  constructor(private readonly httpService: HttpService) {}

  private s3client: S3Client = new S3Client({
    apiVersion: '2006-03-01',
    credentials: {
      accessKeyId: process.env.DOPS_S3_ACCESSKEYID,
      secretAccessKey: process.env.DOPS_S3_SECRETACCESSKEY,
    },
    endpoint: process.env.DOPS_S3_ENDPOINT,
    forcePathStyle: true,
    region: 'ca-central-1',
  });

  async uploadFile(
    file: Express.Multer.File | IFile,
    filePath?: string,
  ): Promise<CompleteMultipartUploadCommandOutput> {
    const client = this.s3client;
    const upload = new Upload({
      client,
      params: {
        Bucket: process.env.DOPS_S3_BUCKET,
        Key: process.env.DOPS_S3_KEY + '/' + filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
        //TODO Add metadata
        //Metadata
      },
    });

    return (await upload.done()) as CompleteMultipartUploadCommandOutput;
  }

  async getFile(
    filePath: string,
    res?: Response,
  ): Promise<NodeJS.ReadableStream> {
    const params = {
      Bucket: process.env.DOPS_S3_BUCKET,
      Key: process.env.DOPS_S3_KEY + '/' + filePath,
    };

    try {
      const response = await this.s3client.send(new GetObjectCommand(params));
      if (res) this._processS3Headers(response, res);
      const stream = response.Body as NodeJS.ReadableStream;
      return stream;
    } catch (e) {
      console.log(e);
    }
  }

  async presignUrl(filePath: string): Promise<string> {
    const params = {
      Bucket: process.env.DOPS_S3_BUCKET,
      Key: process.env.DOPS_S3_KEY + '/' + filePath,
    };

    const command = new GetObjectCommand(params);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const url = await getSignedUrl(this.s3client, command, {
      expiresIn: +process.env.DOPS_S3_PRESIGNED_URL_EXPIRY,
    });

    return url;
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
