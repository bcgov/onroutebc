import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { ReadCOMSDto } from './dto/response/read-coms.dto';
import { ReadFileDto } from './dto/response/read-file.dto';

@Injectable()
export class ComsService {
  constructor(private readonly httpService: HttpService) {}

  async createObject(file: Express.Multer.File): Promise<ReadCOMSDto[]> {
    const { buffer, originalname } = file;
    const fd = new FormData();
    fd.append('file', new Blob([buffer]), originalname);

    const reqConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      auth: {
        username: process.env.BASICAUTH_USERNAME,
        password: process.env.BASICAUTH_PASSWORD,
      },
    };

    const url = process.env.COMS_URL + `object?tagset[x]=a`;
    const responseData: ReadCOMSDto[] = await lastValueFrom(
      this.httpService.post(url, fd, reqConfig).pipe(
        map((response) => {
          return response;
        }),
      ),
    )
      .then((response) => {
        return response.data as ReadCOMSDto[];
      })
      .catch((error) => {
        console.log(error);
        throw new InternalServerErrorException();
      });

    return responseData;
  }

  async getObjectUrl(readFile: ReadFileDto): Promise<string> {
    const reqConfig: AxiosRequestConfig = {
      headers: {
        Accept: 'application/json',
      },
      auth: {
        username: process.env.BASICAUTH_USERNAME,
        password: process.env.BASICAUTH_PASSWORD,
      },
    };

    const url =
      process.env.COMS_URL +
      `object/${readFile.s3ObjectId}?download=url&expiresIn=${process.env.COMS_PRESIGNED_URL_EXPIRY}}`;
    const responseData: string = await lastValueFrom(
      this.httpService.get(url, reqConfig).pipe(
        map((response) => {
          return response;
        }),
      ),
    )
      .then((response) => {
        return response.data as string;
      })
      .catch((error) => {
        console.log(error);
        throw new InternalServerErrorException();
      });

    return responseData;
  }
}
