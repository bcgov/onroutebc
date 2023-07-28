/**
 * Service responsible for interacting with DOPS (Document Operations Service).
 */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { IUserJWT } from '../../common/interface/user-jwt.interface';
import { DopsGeneratedDocument } from '../../common/interface/dops-generated-document.interface';
import { IFile } from '../../common/interface/file.interface';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Response } from 'express';
import { FileDownloadModes } from '../../common/enum/file-download-modes.enum';
import { ReadFileDto } from './dto/response/read-file.dto';

@Injectable()
export class DopsService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Downloads a document from from DOPS.
   * @param currentUser - The current user details of type {@link IUserJWT}
   * @param dmsId - The Id of the document in DOPS.
   * @param download - The file download mode - {@link FileDownloadModes}.
   * @param res - An optional Response object.
   * @returns A Promise that resolves to an object of type {@link IFile}. Null
   * is returned if Response object was passed as a parameter.
   */
  async download(
    currentUser: IUserJWT,
    dmsId: string,
    download = FileDownloadModes.URL,
    res?: Response,
    companyId?: number,
  ): Promise<ReadFileDto | Buffer> {
    // Construct the URL for the request
    const url = `${process.env.DOPS_URL}/dms/${dmsId}`;

    const reqConfig: AxiosRequestConfig = {
      params: {
        download: download,
        companyId: companyId ? companyId : undefined,
      },
      headers: {
        Authorization: currentUser.access_token,
        'Content-Type': 'application/json',
      },
      responseType: download === FileDownloadModes.PROXY ? 'stream' : 'json',
    };

    // Calls the DOPS service, which converts the the template document into a pdf
    const dopsResponse = await lastValueFrom(
      this.httpService.get(url, reqConfig).pipe(
        map((response) => {
          return response;
        }),
      ),
    )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log('DOPS GET DMS url Error: ', error);
        throw error;
      });

    if (download === FileDownloadModes.PROXY) {
      if (res) {
        this.convertAxiosToExpress(dopsResponse, res);
        const responseData = dopsResponse.data as NodeJS.ReadableStream;
        responseData.pipe(res);
      }
      const file = await this.createFile(
        dopsResponse.data as NodeJS.ReadableStream,
      );
      return file;
    }

    return dopsResponse.data as ReadFileDto;
  }

  /**
   * Generates a document from template via DOPS.
   * @param currentUser - The current user details of type {@link IUserJWT}
   * @param dopsGeneratedDocument - The template details and data of type
   *               {@link DopsGeneratedDocument}.
   * @param res - An optional Response object.
   * @returns A Promise that resolves to an object of type {@link IFile}. Null
   * is returned if Response object was passed as a parameter.
   */
  async generateDocument(
    currentUser: IUserJWT,
    dopsGeneratedDocument: DopsGeneratedDocument,
    res?: Response,
    companyId?: number,
  ): Promise<IFile> {
    // Construct the URL for the request
    const url = process.env.DOPS_URL + `/dgen/template/render`;

    const reqConfig: AxiosRequestConfig = {
      params: { companyId: companyId ? companyId : undefined },
      headers: {
        Authorization: currentUser.access_token,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
    };

    // Calls the DOPS service, which converts the the template document into a pdf
    const dopsResponse = await lastValueFrom(
      this.httpService.post(url, dopsGeneratedDocument, reqConfig),
    )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log('generate Document error: ', error);
        throw error;
      });

    if (res) {
      this.convertAxiosToExpress(dopsResponse, res);
      const responseData = dopsResponse.data as NodeJS.ReadableStream;
      responseData.pipe(res);
      return null;
    }
    const file = await this.createFile(
      dopsResponse.data as NodeJS.ReadableStream,
    );

    const generatedDocument: IFile = {
      originalname: dopsGeneratedDocument.generatedDocumentFileName,
      encoding: dopsResponse.headers['Content-Transfer-Encoding'] as string,
      mimetype: dopsResponse.headers['Content-Type'] as string,
      buffer: file,
      size: dopsResponse.headers['Content-Length'] as number,
      dmsId: dopsResponse.headers['x-orbc-dms-id'] as string,
    };

    return generatedDocument;
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
