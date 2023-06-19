import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { GovCommonServices } from '../enum/gov-common-services.enum';
import { InternalServerErrorException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GovCommonServicesToken } from '../interface/gov-common-services-token.interface';

const CHES_ACCESS_TOKEN = 'CHES_ACCESS_TOKEN';
const CDOGS_ACCESS_TOKEN = 'CDOGS_ACCESS_TOKEN';
export async function getAccessToken(
  govCommonServices: GovCommonServices,
  httpService: HttpService,
  cacheManager: Cache,
) {
  let tokenKey: string = undefined;
  let tokenUrl: string = undefined;
  let username: string = undefined;
  let password: string = undefined;
  if (govCommonServices === GovCommonServices.COMMON_HOSTED_EMAIL_SERVICE) {
    tokenKey = CHES_ACCESS_TOKEN;
    tokenUrl = process.env.CHES_TOKEN_URL;
    username = process.env.CHES_CLIENT_ID;
    password = process.env.CHES_CLIENT_SECRET;
  } else if (
    govCommonServices === GovCommonServices.COMMON_DOCUMENT_GENERATION_SERVICE
  ) {
    tokenKey = CDOGS_ACCESS_TOKEN;
    tokenUrl = process.env.CDOGS_TOKEN_URL;
    username = process.env.CDOGS_CLIENT_ID;
    password = process.env.CDOGS_CLIENT_SECRET;
  }

  const tokenFromCache: GovCommonServicesToken = await cacheManager.get(
    tokenKey,
  );
  if (tokenFromCache) {
    if (Date.now() < tokenFromCache.expires_at) {
      return tokenFromCache.access_token;
    }
  }

  const reqData = 'grant_type=client_credentials';

  const reqConfig: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: username,
      password: password,
    },
  };

  const token = await lastValueFrom(
    httpService.post(tokenUrl, reqData, reqConfig),
  )
    .then((response) => {
      return response.data as GovCommonServicesToken;
    })
    .catch((error) => {
      console.log('Error: getCommonServiceAccessToken() ', error);
      throw new InternalServerErrorException();
    });

  token.expires_at = Date.now() + (token.expires_in - 15) * 1000;

  await cacheManager.set(tokenKey, token);

  return token.access_token;
}
