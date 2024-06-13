import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { getAccessToken } from '../../../common/helper/gov-common-services.helper';
import { GovCommonServices } from '../../../common/enum/gov-common-services.enum';

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
  const token = await getAccessToken(
    GovCommonServices.CREDIT_ACCOUNT_SERVICE,
    httpService,
    cacheManager,
  );
  const response = await httpService.axiosRef.post<
    any,
    AxiosResponse<ResponseBody>,
    RequestBody
  >(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response;
}
