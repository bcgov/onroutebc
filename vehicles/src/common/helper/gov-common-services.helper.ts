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

/**
 * Retrieves an access token for the specified government common service.
 *
 * The function first checks the cache for an existing token. If a valid token is found, it is returned.
 * If there is no valid token in the cache, a new token is requested from the token URL using client credentials.
 * The new token is then cached with an expiration time before being returned.
 *
 * @param {GovCommonServices} govCommonServices - The specific government common service for which the access token is required.
 * @param {HttpService} httpService - The HTTP service used to make the token request.
 * @param {Cache} cacheManager - The cache manager used to store and retrieve cached tokens.
 * @returns {Promise<string>} A promise that resolves to the access token.
 * @throws {InternalServerErrorException} If an error occurs while acquiring the token.
 */
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

/**
 * Retrieves the token credentials required for accessing government common services.
 *
 * @param {GovCommonServices} govCommonServices - The specific government common service for which the credentials are needed.
 * @returns {Object} An object containing the following properties:
 *  - tokenCacheKey: {CacheKey} The key used to cache the token.
 *  - tokenUrl: {string} The URL used to request the token.
 *  - username: {string} The username/client ID for the token request.
 *  - password: {string} The password/client secret for the token request.
 */
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
      tokenUrl = `${process.env.CFS_CREDIT_ACCOUNT_URL}/oauth/token`;
      username = process.env.CFS_CREDIT_ACCOUNT_CLIENT_ID;
      password = process.env.CFS_CREDIT_ACCOUNT_CLIENT_SECRET;
      break;
    case GovCommonServices.ORBC_SERVICE_ACCOUNT:
      tokenCacheKey = CacheKey.ORBC_SERVICE_ACCOUNT_ACCESS_TOKEN;
      tokenUrl = process.env.ORBC_SERVICE_ACCOUNT_TOKEN_URL;
      username = process.env.ORBC_SERVICE_ACCOUNT_CLIENT_ID;
      password = process.env.ORBC_SERVICE_ACCOUNT_CLIENT_SECRET;
      break;
    default:
      break;
  }
  return { tokenCacheKey, tokenUrl, username, password };
}
