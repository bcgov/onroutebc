import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureFlag } from './entities/feature-flag.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LogAsyncMethodExecution } from 'src/decorator/log-async-method-execution.decorator';
import { CacheKey } from 'src/enum/cache-key.enum';

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
}
