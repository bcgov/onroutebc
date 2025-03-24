import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { Province } from './entities/province.entity';
import { LogAsyncMethodExecution } from '../../common/decorator/log-async-method-execution.decorator';
import { Permit } from '../permit-application-payment/permit/entities/permit.entity';
import { Policy, ValidationResults } from 'onroute-policy-engine';
import { ReadPolicyConfigDto } from '../policy/dto/response/read-policy-config.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { CacheKey } from '../../common/enum/cache-key.enum';
import { getActivePolicyDefinitions } from '../../common/helper/policy-engine.helper';
import { addToCache } from '../../common/helper/cache.helper';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @LogAsyncMethodExecution()
  async findOneCountry(countryCode: string): Promise<Country> {
    return await this.countryRepository.findOne({
      where: { countryCode: countryCode },
    });
  }

  @LogAsyncMethodExecution()
  async findAllCountries(): Promise<Country[]> {
    return await this.countryRepository.find({});
  }

  @LogAsyncMethodExecution()
  async findOneProvince(provinceCode: string): Promise<Province> {
    return await this.provinceRepository.findOne({
      where: { provinceCode: provinceCode },
    });
  }

  @LogAsyncMethodExecution()
  async findAllProvinces(): Promise<Province[]> {
    return await this.provinceRepository.find({});
  }

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
  ): Promise<ValidationResults> {
    const policyDefinitions: string = await this.cacheManager.get(
      CacheKey.POLICY_CONFIGURATIONS,
    );
    if (!policyDefinitions) {
      const policyDefinitions = await getActivePolicyDefinitions(
        this.httpService,
        this.cacheManager,
      );
      if (!policyDefinitions) {
        throw new InternalServerErrorException(
          'Policy engine is not available',
        );
      }
      await addToCache(
        this.cacheManager,
        CacheKey.POLICY_CONFIGURATIONS,
        JSON.stringify(policyDefinitions),
      );
    }
    const activePolicyDefintion = JSON.parse(
      policyDefinitions,
    ) as ReadPolicyConfigDto;
    const policy = new Policy(activePolicyDefintion.policy);
    const validationResults: ValidationResults =
      await policy.validate(permitApplication);
    return validationResults;
  }
}
