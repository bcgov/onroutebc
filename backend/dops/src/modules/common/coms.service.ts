/**
 * Service responsible for interacting with COMS (Content Object Management
 * System).
 */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ReadCOMSDto } from './dto/response/read-coms.dto';
import { ReadFileDto } from '../dms/dto/response/read-file.dto';
import { IFile } from '../../interface/file.interface';
import { Response } from 'express';
import { FileDownloadModes } from '../../enum/file-download-modes.enum';
import { lastValueFrom, map } from 'rxjs';
import { IUserJWT } from '../../interface/user-jwt.interface';

@Injectable()
export class ComsService {
  constructor(private readonly httpService: HttpService) {}

  private comsServiceType = process.env.COMS_SERVICE;
  private comsBucketId = process.env.COMS_BUCKET_ID;

  /**
   * Creates an object in COMS.
   * @param currentUser - The current user details of type {@link IUserJWT}
   * @param file - The file to be uploaded. It can be either an
   *               {@link Express.Multer.File} object or an {@link IFile}
   *               object.
   * @param s3ObjectId: An optional S3 Object Id.
   * @returns A Promise that resolves to an array of ReadCOMSDto objects
   *          representing the created objects.
   */
  async createOrUpdateObject(
    currentUser: IUserJWT,
    file: Express.Multer.File | IFile,
    s3ObjectId?: string,
  ): Promise<ReadCOMSDto[]> {
    // Extract necessary properties from the file
    const { buffer, originalname, filename, mimetype } = file;

    // Create a FormData object and append the file to it
    const fd = new FormData();
    //ExperimentalWarning: buffer.File is an experimental feature and might change at any time
    fd.append(
      'file',
      new Blob([buffer], { type: mimetype }),
      filename ? filename : originalname,
    );

    // Set the request configuration
    const reqConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization:
          this.comsServiceType === 'hosted'
            ? currentUser.access_token
            : undefined,
      },
      auth:
        this.comsServiceType !== 'hosted'
          ? {
              username: process.env.BASICAUTH_USERNAME,
              password: process.env.BASICAUTH_PASSWORD,
            }
          : undefined,
    };

    // Construct the URL for the request
    let url = process.env.COMS_URL + `object`;
    if (s3ObjectId) {
      url = url.concat('/', s3ObjectId);
    } else if (this.comsServiceType === 'hosted' && this.comsBucketId) {
      url = url.concat('?', 'bucketId=', this.comsBucketId);
    }

    // Send the POST request to create the object and retrieve the response
    const responseData: ReadCOMSDto[] = await lastValueFrom(
      this.httpService.post(url, fd, reqConfig).pipe(
        map((response) => {
          return response;
        }),
      ),
    )
      .then((response) => {
        if (s3ObjectId) {
          return [response.data as ReadCOMSDto];
        }
        return response.data as ReadCOMSDto[];
      })
      .catch((error) => {
        console.error('createObject error: ', error);
        throw new InternalServerErrorException();
      });

    return responseData;
  }

  /**
   * Retrieves an object from COMS.
   * @param currentUser - The current user details of type {@link IUserJWT}
   * @param readFile - The {@link ReadFileDto} object containing the information
   *                   about the file to be retrieved.
   * @param download - The file download mode - {@link FileDownloadModes}.
   * @param res - An optional Response object.
   * @returns A Promise that resolves to a string (url) or Buffer (proxy)
   *          representing the retrieved object.
   */
  async getObject(
    currentUser: IUserJWT,
    readFile: ReadFileDto,
    download = FileDownloadModes.URL,
    res?: Response,
  ): Promise<string | Buffer> {
    // Set the request configuration
    const reqConfig: AxiosRequestConfig = {
      headers: {
        Authorization:
          this.comsServiceType === 'hosted'
            ? currentUser.access_token
            : undefined,
      },
      auth:
        this.comsServiceType !== 'hosted'
          ? {
              username: process.env.BASICAUTH_USERNAME,
              password: process.env.BASICAUTH_PASSWORD,
            }
          : undefined,
      responseType: download === FileDownloadModes.PROXY ? 'stream' : 'json',
    };

    // Set the request parameters
    const params = {
      download: download,
      expiresIn: process.env.COMS_PRESIGNED_URL_EXPIRY,
    };

    // Construct the URL for the request
    const url = `${
      process.env.COMS_URL
    }object/${readFile.s3ObjectId?.toLowerCase()}`;

    // Send the GET request to retrieve the object and retrieve the response
    const axiosResponse = await lastValueFrom(
      this.httpService.get(url, { params, ...reqConfig }).pipe(
        map((response) => {
          return response;
        }),
      ),
    )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error('COMS getObject url Error: ', error);
        throw new InternalServerErrorException();
      });

    if (download === FileDownloadModes.PROXY) {
      if (res) {
        this.convertAxiosToExpress(axiosResponse, res);
        const responseData = axiosResponse.data as NodeJS.ReadableStream;
        responseData.pipe(res);
        /*Wait for the stream to end before sending the response status and
        headers. This ensures that the client receives a complete response and
        prevents any issues with partial responses or response headers being
        sent prematurely.*/
        responseData.on('end', () => {
          return null;
        });
        responseData.on('error', () => {
          throw new Error('An error occurred while reading the file.');
        });
      }
      const file = await this.createFile(
        axiosResponse.data as NodeJS.ReadableStream,
      );
      return file;
    }
    return axiosResponse.data as string;
  }

  /**
   * Converts the headers from an Axios response to Express response headers.
   * @param response - The {@link AxiosResponse} object containing the response
   *                   headers.
   * @param res - The Express {@link Response} object.
   */
  convertAxiosToExpress(response: AxiosResponse, res: Response) {
    // Get the headers from the Axios response
    const headers = response.headers;

    // Set the headers in the Express response object using the res.set() method
    Object.keys(headers).forEach((key) => {
      res.set(key, headers[key] as string);
    });
  }

  /**
   * Creates a file from a stream of data.
   * @param data - The stream of data to create a file from.
   * @returns A Promise resolving to a Buffer representing the created file.
   */
  private async createFile(data: NodeJS.ReadableStream) {
    // Read the stream data and concatenate all chunks into a single Buffer
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      data.on('data', (chunk: Buffer) => chunks.push(chunk));
      data.on('end', () => resolve(Buffer.concat(chunks)));
      data.on('error', (err) => reject(err));
    });
  }
}
