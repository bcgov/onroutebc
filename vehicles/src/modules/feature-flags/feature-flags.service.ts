import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogAsyncMethodExecution } from 'src/common/decorator/log-async-method-execution.decorator';
import { Repository } from 'typeorm';
import { ReadFeatureFlagDto } from './dto/response/read-feature-flag.dto';
import { FeatureFlag } from './entities/feature-flag.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKey } from '../../common/enum/cache-key.enum';

@Injectable()
export class FeatureFlagsService {
  constructor(
    @InjectRepository(FeatureFlag)
    private featureFlagRepository: Repository<FeatureFlag>,
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * The findAll() method returns an array of ReadFeatureFlagDto objects.
   * It retrieves the entities from the database using the Repository,
   * maps it to a DTO object using the Mapper, and returns it.
   *
   * @returns The feature flag list as a promise of type {@link ReadFeatureFlagDto}
   */
  @LogAsyncMethodExecution()
  async findAll(): Promise<ReadFeatureFlagDto[]> {
    return this.classMapper.mapArrayAsync(
      await this.featureFlagRepository.find(),
      FeatureFlag,
      ReadFeatureFlagDto,
    );
  }

  /**
   * The findAllFromCache() method returns an array of ReadFeatureFlagDto objects
   * which were stored in the NestJS system cache upon startup.
   *
   * @returns The feature flag list as a promise of type {@link ReadFeatureFlagDto}
   */
  @LogAsyncMethodExecution()
  async findAllFromCache(): Promise<ReadFeatureFlagDto[]> {
    return await this.cacheManager.get(CacheKey.FEATURE_FLAG_TYPE);
  }
}
