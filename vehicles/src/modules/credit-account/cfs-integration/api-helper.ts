import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { getCreditAccessToken } from '../../../common/helper/gov-common-services.helper';
import { Cache } from 'cache-manager';
import { HttpStatus } from '@nestjs/common';

export async function cfsPostRequest<RequestBody, ResponseBody>(
  {
    httpService,
    cacheManager,
  }: {
    httpService: HttpService;
    cacheManager: Cache;
  },
  { url, data }: { url: string; data: RequestBody },
) {
  const token = await getCreditAccessToken(httpService, cacheManager);
  //  Axios.post<any, AxiosResponse<any, any>, RequestBody>
  const response = await httpService.axiosRef.post<any, AxiosResponse<ResponseBody>, RequestBody> (url, data as RequestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response as AxiosResponse<ResponseBody, any>;
}
