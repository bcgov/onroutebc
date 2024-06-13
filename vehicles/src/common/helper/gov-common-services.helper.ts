import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { lastValueFrom } from 'rxjs';
import { GovCommonServices } from '../enum/gov-common-services.enum';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GovCommonServicesToken } from '../interface/gov-common-services-token.interface';
import { CacheKey } from '../enum/cache-key.enum';
import { TOKEN_EXPIRY_BUFFER } from '../constants/api.constant';

const logger = new Logger('GovCommonServicesHelper');

export async function getAccessToken(
  govCommonServices: GovCommonServices,
  httpService: HttpService,
  cacheManager: Cache,
) {
  const { tokenCacheKey, tokenUrl, username, password } =
    getTokenCredentials(govCommonServices);

  const tokenFromCache: GovCommonServicesToken =
    await cacheManager.get(tokenCacheKey);
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
    .catch((error: AxiosError) => {
      if (error.response) {
        const errorData = error.response.data as {
          error: string;
          error_description?: string;
        };
        logger.error(
          `Error response from token issuer: ${JSON.stringify(
            errorData,
            null,
            2,
          )}`,
        );
      } else {
        logger.error(error?.message, error?.stack);
      }
      throw new InternalServerErrorException(
        `Error acquiring token from ${tokenUrl}`,
      );
    });
  token.expires_at =
    Date.now() + (token.expires_in - TOKEN_EXPIRY_BUFFER) * 1000;

  await cacheManager.set(tokenCacheKey, token);

  return token.access_token;
}

function getTokenCredentials(govCommonServices: GovCommonServices): {
  tokenCacheKey: CacheKey;
  tokenUrl: string;
  username: string;
  password: string;
} {
  let tokenCacheKey: CacheKey = undefined;
  let tokenUrl: string = undefined;
  let username: string = undefined;
  let password: string = undefined;
  switch (govCommonServices) {
    case GovCommonServices.COMMON_HOSTED_EMAIL_SERVICE:
      tokenCacheKey = CacheKey.CHES_ACCESS_TOKEN;
      tokenUrl = process.env.CHES_TOKEN_URL;
      username = process.env.CHES_CLIENT_ID;
      password = process.env.CHES_CLIENT_SECRET;
      break;
    case GovCommonServices.COMMON_DOCUMENT_GENERATION_SERVICE:
      tokenCacheKey = CacheKey.CDOGS_ACCESS_TOKEN;
      tokenUrl = process.env.CDOGS_TOKEN_URL;
      username = process.env.CDOGS_CLIENT_ID;
      password = process.env.CDOGS_CLIENT_SECRET;
      break;
    case GovCommonServices.CREDIT_ACCOUNT_SERVICE:
      tokenCacheKey = CacheKey.CREDIT_ACCOUNT_ACCESS_TOKEN;
      tokenUrl = `${process.env.CREDIT_ACCOUNT_URL}/oauth/token`;
      username = process.env.CREDIT_ACCOUNT_CLIENT_ID;
      password = process.env.CREDIT_ACCOUNT_CLIENT_SECRET;
      break;

    default:
      break;
  }
  return { tokenCacheKey, tokenUrl, username, password };
}
