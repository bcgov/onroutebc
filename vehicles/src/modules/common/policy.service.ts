import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { Permit } from '../permit-application-payment/permit/entities/permit.entity';
import { Policy, ValidationResults } from 'onroute-policy-engine';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { CacheKey } from '../../common/enum/cache-key.enum';
import { convertToPolicyApplication } from '../../common/helper/policy.helper';
import { addToCache } from '../../common/helper/cache.helper';
import { ClsService } from 'nestjs-cls';
import { getAccessToken } from '../../common/helper/gov-common-services.helper';
import { GovCommonServices } from '../../common/enum/gov-common-services.enum';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { SpecialAuth } from '../special-auth/entities/special-auth.entity';
import { Nullable } from '../../common/types/common';
import { SpecialAuthorizations } from 'onroute-policy-engine/types';
import { PolicyConfiguration } from '../../common/interface/policy-configuration-report.interface';

@Injectable()
export class PolicyService {
  private readonly logger = new Logger(PolicyService.name);
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly cls: ClsService,
  ) {}

  /**
   * Validates a permit application using the policy engine.
   *
   * This method retrieves the active policy definitions to validate
   * the given permit application and returns the validation results.
   *
   * The policy definitions are fetched from the cache if available;
   * otherwise, it retrieves them from the policy service and stores
   * them in the cache for future requests.
   * If the policy engine is unavailable, an InternalServerErrorException
   * is thrown.
   *
   * @param {Permit} permitApplication - The permit application to be validated.
   * @returns {Promise<ValidationResults>} - The results of the validation process.
   * @throws {InternalServerErrorException} - If the policy engine is not available.
   */
  @LogAsyncMethodExecution()
  async validateWithPolicyEngine(
    permitApplication: Permit,
    specialAuth?: Nullable<SpecialAuth>,
  ): Promise<ValidationResults> {
    let activePolicyDefintion: PolicyConfiguration =
      await this.cacheManager.get(CacheKey.POLICY_CONFIGURATIONS);
    if (!activePolicyDefintion) {
      const policyDefinitions = await this.getActivePolicyDefinitions(
        this.httpService,
        this.cacheManager,
        this.cls,
      );
      if (!policyDefinitions) {
        throw new InternalServerErrorException(
          'Policy engine is not available',
        );
      }
      await addToCache(
        this.cacheManager,
        CacheKey.POLICY_CONFIGURATIONS,
        policyDefinitions,
      );
    }

    activePolicyDefintion = await this.cacheManager.get(
      CacheKey.POLICY_CONFIGURATIONS,
    );

    const specialAuthorizations: SpecialAuthorizations = {
      companyId: specialAuth?.company?.companyId,
      isLcvAllowed: specialAuth?.isLcvAllowed,
      noFeeType: specialAuth?.noFeeType,
    };

    const policy = new Policy(
      activePolicyDefintion.policy,
      specialAuthorizations,
    );

    const validationResults: ValidationResults = await policy.validate(
      convertToPolicyApplication(permitApplication),
    );

    if (!validationResults) {
      this.logger.error('Policy Engine Validation Failure');
      throw new InternalServerErrorException(
        'Policy Engine Validation Failure',
      );
    }

    return validationResults;
  }

  @LogAsyncMethodExecution()
  async getActivePolicyDefinitions(
    httpService: HttpService,
    cacheManager: Cache,
    cls: ClsService,
  ): Promise<PolicyConfiguration> {
    const token = await getAccessToken(
      GovCommonServices.ORBC_SERVICE_ACCOUNT,
      httpService,
      cacheManager,
    );

    const baseUrl = new URL(process.env.POLICY_URL);
    // Append the path and query parameter(s)
    baseUrl.pathname += 'policy-configurations';
    // Retrieve the current policy configuration
    baseUrl.searchParams.set('isCurrent', 'true');

    try {
      const response = await httpService.axiosRef.get<PolicyConfiguration[]>(
        baseUrl?.toString(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-correlation-id': cls.getId(),
          },
          responseType: 'json',
        },
      );
      const policyConfigArray = response.data;
      return policyConfigArray?.at(0);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // Log and throw error if the request fails
        if (error.response) {
          const errorData = error.response.data as ExceptionDto;
          this.logger.error(
            `Error response from Policy Api: ${JSON.stringify(errorData, null, 2)}`,
          );
        } else {
          this.logger.error(error?.message, error?.stack);
        }
        throw new InternalServerErrorException(
          'Error while fetching policy configuration',
        );
      }
    }
  }
}
