/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  constructor(private readonly httpService: HttpService) {}

  async sendEmailMessage(
    messageBody: string,
    subject: string,
    to: string[],
  ): Promise<string> {
    const token = await this.getAccessToken();

    // const fs = require('fs');

    //   const file='/src/common/asset/onRouteBC-logo.png';
    //  // read binary data

    //   const bitmap = fs.readFileSync(file);
    //   // convert binary data to base64 encoded string
    //   const buffer = new Buffer(bitmap).toString('base64');

    const requestData = {
      bcc: [],
      bodyType: 'html',
      body: messageBody,
      cc: [],
      delayTS: 0,
      encoding: 'utf-8',
      from: 'noreply-OnRouteBC@gov.bc.ca',
      priority: 'normal',
      subject: subject,
      to: to,
    };

    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token.access_token,
      },
    };

    const responseData = await lastValueFrom(
      this.httpService
        .post(
          'https://ches-dev.api.gov.bc.ca/api/v1/email',
          requestData,
          requestConfig,
        )
        .pipe(
          map((response) => {
            return response;
          }),
        ),
    )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error.response);
        return error.response;
      });

    return responseData;
  }

  private async getAccessToken() {
    const reqData = 'grant_type=client_credentials';

    const reqConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.CHES_CLIENT_ID,
        password: process.env.CHES_CLIENT_SECRET,
      },
    };

    const token = await lastValueFrom(
      this.httpService.post(
        'https://dev.loginproxy.gov.bc.ca/auth/realms/comsvcauth/protocol/openid-connect/token',
        reqData,
        reqConfig,
      ),
    )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error.response);
        return error.response;
      });
    return token;
  }
}
