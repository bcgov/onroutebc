import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LogAsyncMethodExecution } from './common/decorator/log-async-method-execution.decorator';
import { CacheKey } from './common/enum/cache-key.enum';
import { FeatureFlagsService } from './modules/feature-flags/feature-flags.service';
import { addToCache, createCacheMap } from './common/helper/cache.helper';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private featureFlagsService: FeatureFlagsService,
  ) {}

  getHealthCheck(): string {    
    return 'TPS Migration Healthcheck!';
  }

  @LogAsyncMethodExecution({ printMemoryStats: true })
  async initializeCache() {
    const startDateTime = new Date();
    const featureFlags = await this.featureFlagsService.findAll();
    
    await addToCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
      createCacheMap(featureFlags, 'featureKey', 'featureValue'),
    );

    const endDateTime = new Date();
    const processingTime = endDateTime.getTime() - startDateTime.getTime();
    this.logger.log(
      `initializeCache() -> Start time: ${startDateTime.toISOString()},` +
        `End time: ${endDateTime.toISOString()},` +
        `Processing time: ${processingTime}ms`,
    );
  }
}
