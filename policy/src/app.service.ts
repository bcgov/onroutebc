import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKey } from './enum/cache-key.enum';
import { addToCache, createCacheMap } from './helper/cache.helper';
import { LogAsyncMethodExecution } from './decorator/log-async-method-execution.decorator';
import { FeatureFlagsService } from './modules/feature-flags/feature-flags.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private featureFlagsService: FeatureFlagsService,
  ) {}

  getHello(): string {
    return 'Policy Healthcheck!';
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
