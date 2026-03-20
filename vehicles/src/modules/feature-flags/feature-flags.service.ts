import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { Repository } from 'typeorm';
import { FeatureFlag } from './entities/feature-flag.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKey } from '../../common/enum/cache-key.enum';
import { getMapFromCache } from '../../common/helper/cache.helper';

@Injectable()
export class FeatureFlagsService {
  constructor(
    @InjectRepository(FeatureFlag)
    private featureFlagRepository: Repository<FeatureFlag>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * The findAll() method returns an array of FeatureFlag entities.
   * It retrieves the entities directly from the database using the Repository.
   *
   * @returns The feature flag entity list as a promise of type {@link FeatureFlag[]}
   */
  @LogAsyncMethodExecution()
  async findAll(): Promise<FeatureFlag[]> {
    return await this.featureFlagRepository.find();
  }
  /**
   * The findAllFromCache() method returns a key-value map of the feature flags
   * that were stored in the NestJS system cache upon startup. This method is crucial for
   * operations that require a quick lookup without the need to access the database directly.
   *
   * @returns A promise that resolves to a key-value map where keys and values are strings representing the feature flags.
   */
  @LogAsyncMethodExecution()
  async findAllFromCache(): Promise<Record<string, string>> {
    const featureFlagMap = await getMapFromCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
    );
    return featureFlagMap?.size
      ? (Object.fromEntries(featureFlagMap) as Record<string, string>)
      : undefined;
  }
}
