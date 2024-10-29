import { Permit } from 'src/modules/permit-application-payment/permit/entities/permit.entity';
import { PolicyApplication } from '../interface/policy-application.interface';
import { PermitData } from '../interface/permit.template.interface';
import { getAccessToken } from './gov-common-services.helper';
import { GovCommonServices } from '../enum/gov-common-services.enum';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { AxiosResponse } from 'axios';
import { ReadPolicyConfigDto } from '../../modules/policy/dto/response/read-policy-config.dto';
import { Policy, ValidationResults } from 'onroute-policy-engine';

export const convertToPolicyApplication = (
  application: Permit,
): PolicyApplication => {
  return {
    permitType: application.permitType,
    permitData: JSON.parse(application.permitData.permitData) as PermitData,
  };
};

export const getActivePolicyDefinitions = async (
  httpService: HttpService,
  cacheManager: Cache,
) => {
  const token = await getAccessToken(
    GovCommonServices.ORBC_SERVICE_ACCOUNT,
    httpService,
    cacheManager,
  );
  const response = await httpService.axiosRef.get<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AxiosResponse<Response, any>,
    Request
  >(process.env.ORBC_POLICY_URL + '/policy-configurations', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return (await response.data.json()) as ReadPolicyConfigDto[];
};

export const validateWithPolicyEngine = async (
  permitApplication: unknown,
  cacheManager: Cache,
): Promise<boolean> => {
  const policyDefinitions: ReadPolicyConfigDto[] = await cacheManager.get(
    'active-policy-definitions',
  );
  const policy = new Policy(policyDefinitions);
  const validationResults: ValidationResults =
    await policy.validate(permitApplication);

  return validationResults.violations.length > 0;
};
