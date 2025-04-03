import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import {
  Policy,
  ValidationResult,
  ValidationResults,
} from 'onroute-policy-engine';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { ClsService } from 'nestjs-cls';
import { SpecialAuthorizations } from 'onroute-policy-engine/types';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { Nullable } from '../../common/types/common';
import { SpecialAuth } from '../special-auth/entities/special-auth.entity';
import { Permit } from '../permit-application-payment/permit/entities/permit.entity';
import { PolicyConfiguration } from '../../common/interface/policy-configuration-report.interface';
import { CacheKey } from '../../common/enum/cache-key.enum';
import { addToCache } from '../../common/helper/cache.helper';
import { convertToPolicyApplication } from '../../common/helper/policy.helper';
import { getAccessToken } from '../../common/helper/gov-common-services.helper';
import { GovCommonServices } from '../../common/enum/gov-common-services.enum';
import { ExceptionDto } from '../../common/exception/exception.dto';
import { ApplicationStatus } from '../../common/enum/application-status.enum';
import { calculatePermitAmount } from '../../common/helper/permit-fee.helper';
import { SpecialAuthService } from '../special-auth/special-auth.service';
import { DataSource, QueryRunner } from 'typeorm';
import {
  findApplicationForPE,
  findPermitHistory,
} from '../../common/helper/permit-application.helper';
import { getQueryRunner } from '../../common/helper/database.helper';
import { PermitData } from '../../common/interface/permit.template.interface';
import { LoaService } from '../special-auth/loa.service';
import { validateLoas } from '../../common/helper/validate-loa.helper';

@Injectable()
export class PolicyService {
  private readonly logger = new Logger(PolicyService.name);
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly cls: ClsService,
    private readonly specialAuthService: SpecialAuthService,
    private readonly loaService: LoaService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Retrieves the active policy definitions from the policy service.
   *
   * This method uses the provided HttpService to send a GET request to the
   * policy URL endpoint, with the 'isCurrent' query parameter set to 'true',
   * in order to fetch the current policy configuration.
   *
   * It generates an access token for authentication, using the GOV service account details,
   * and includes the token in the request header for authorization.
   *
   * In case the request fails, it logs the error and throws an
   * InternalServerErrorException.
   *
   * @param {HttpService} httpService - The service to make HTTP requests.
   * @param {Cache} cacheManager - The cache manager instance.
   * @param {ClsService} cls - The CLS service to get the correlation ID.
   * @returns {Promise<PolicyConfiguration>} - The active policy configuration.
   * @throws {InternalServerErrorException} - If there is an error in fetching the policy configuration.
   */
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

  /**
   * Validates a permit application using the policy engine.
   *
   * This method retrieves active policy definitions to validate
   * the given permit application and returns the validation results.
   *
   * It first attempts to fetch policy definitions from the cache;
   * if unavailable, it retrieves them from the policy service,
   * then stores them in the cache for subsequent requests.
   * If the policy engine is unavailable or validation fails,
   * an InternalServerErrorException is thrown.
   *
   * @param {Permit} permitApplication - The permit application to be validated.
   * @param {Nullable<SpecialAuth>} specialAuth - Optional special authorizations for validation.
   * @returns {Promise<ValidationResults>} - The results of the validation process.
   * @throws {InternalServerErrorException} - If the policy engine is unavailable or validation fails.
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

  /**
   * Validates an application and calculates its associated cost.
   *
   * This method uses different services to retrieve application data, validate permissions and authorization,
   * and compute the resulting permit costs based on specified business logic. If no application is provided,
   * it fetches the application data using given identifiers and a query runner. It handles information about
   * letters of authorization (LOAs) and applies specific considerations in case of revoked or voided permits.
   * Any validation violations are logged, and transactional processes are rolled back where necessary.
   *
   * @param {Object} args - The arguments required for validation and cost calculation.
   * @param {Nullable<Permit>} args.application - Optional application data.
   * @param {Nullable<string>} args.applicationId - Optional identifier for the application.
   * @param {Nullable<QueryRunner>} args.queryRunner - Optional query runner for database operations.
   * @param {number} args.companyId - The company ID associated with the application.
   * @returns {Promise<ValidationResults>} - The results of validation and cost calculation.
   * @throws {Error} - If an error occurs during the operation, transactions are rolled back and the error is logged.
   */
  @LogAsyncMethodExecution()
  async validateApplicationAndCalculateCost({
    application,
    applicationId,
    queryRunner,
    companyId,
  }: {
    application?: Nullable<Permit>;
    applicationId?: Nullable<string>;
    queryRunner?: Nullable<QueryRunner>;
    companyId: number;
  }): Promise<ValidationResults> {
    let validationResults: ValidationResults;
    let localQueryRunner = true; // Default to using a local query runner
    // Obtain a query runner, possibly reusing an existing one
    ({ localQueryRunner, queryRunner } = await getQueryRunner({
      queryRunner,
      dataSource: this.dataSource,
    }));
    try {
      // Ensure application data is available
      if (!application) {
        application = await findApplicationForPE(
          queryRunner,
          applicationId,
          companyId,
        );
      }

      // Parse permit data from application
      const permitData = JSON.parse(
        application.permitData.permitData,
      ) as PermitData;

      const specialAuth = await this.specialAuthService.findOneWithQueryRunner(
        companyId,
        queryRunner,
      );

      // Validate the application against policy engine
      validationResults = await this.validateWithPolicyEngine(
        application,
        specialAuth,
      );

      // Extract LOA numbers and validate LOAs
      const loaNumbers = permitData?.loas?.map((loa) => loa.loaNumber);
      const loas = await this.loaService.findLoaByLoaNumber(
        companyId,
        loaNumbers,
        queryRunner,
      );

      const loaValidationResults = validateLoas(application, loas);

      // Handle LOA validation results
      if (loaValidationResults?.length) {
        validationResults?.violations?.push(...loaValidationResults);
      } else if (permitData?.loas?.length) {
        //TODO Remove the else if condition once LOA is implemented in PE
        const index = validationResults?.violations?.findIndex(
          (violation) =>
            violation.type === 'violation' &&
            violation.fieldReference ===
              'permitData.vehicleDetails.vehicleSubType',
        );
        if (index >= 0) {
          validationResults?.violations?.splice(index, 1);
          validationResults?.information?.push({
            type: 'information',
            code: 'loa',
            message: `Policy validation allowing loa vehicle permitting for client ${companyId}`,
          } as ValidationResult);
        }
      }

      // Ensure cost is defined, initialize if necessary
      if (!validationResults?.cost?.length) {
        const cost: ValidationResult = {
          type: 'cost',
          code: 'cost-value',
          message: 'Calculated permit cost',
          cost: 0,
        };

        validationResults.cost?.push(cost);
      }

      validationResults.cost.at(0).cost = validationResults?.cost?.reduce(
        (acc, { cost }) => acc + cost,
        0,
      );

      if (validationResults?.cost?.length > 1) {
        validationResults.cost.length = 1;
      }

      // Handle revoked applications
      if (application.permitStatus === ApplicationStatus.REVOKED) {
        validationResults.violations = null;
        validationResults.cost.at(0).cost = 0;
        return validationResults;
      }

      const permitHistory = await findPermitHistory(
        application.originalPermitId,
        companyId,
        queryRunner,
      );

      if (localQueryRunner) {
        await queryRunner.commitTransaction();
      }
      const existingPermitAmount = calculatePermitAmount(permitHistory);

      // Handle voided applications
      if (application.permitStatus === ApplicationStatus.VOIDED) {
        validationResults.violations = null;
        validationResults.cost.at(0).cost = -existingPermitAmount;
        return validationResults;
      }

      // Adjust cost for new or amended applications without fee
      if (
        (specialAuth?.noFeeType && application.revision === 0) ||
        (application.revision > 0 && existingPermitAmount === 0)
      ) {
        validationResults.cost.at(0).cost = 0;
        return validationResults;
      }
      if (existingPermitAmount > 0) {
        // Deduct existing permit amount if any
        validationResults.cost.at(0).cost -= existingPermitAmount;
      } else {
        // Add existing permit amount if negative or zero
        validationResults.cost.at(0).cost += existingPermitAmount;
      }
    } catch (error) {
      // Rollback transaction in case of an error if using a local query runner
      if (localQueryRunner) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(error);
      throw error; // Rethrow the error after logging
    } finally {
      // Release the local query runner after processing
      if (localQueryRunner) {
        await queryRunner.release();
      }
    }

    return validationResults; // Return the results of validation and cost calculation
  }
}
