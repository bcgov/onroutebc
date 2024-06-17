import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { IsFeatureFlagEnabled } from '../decorator/is-feature-enabled.decorator';
import { CacheKey } from '../enum/cache-key.enum';
import { FeatureFlagValue } from '../enum/feature-flag-value.enum';
import { getMapFromCache } from '../helper/cache.helper';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const featureFlagKey = this.reflector.get(
      IsFeatureFlagEnabled,
      context.getHandler(),
    );
    if (!featureFlagKey) return Promise.resolve(true);
    console.log('featureFlag executing--------------------::');
    console.log('featureFlagKey::', featureFlagKey);
    const isFeatureEnabled = getMapFromCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
    ).then((featureFlags: Record<string, string>) => {
      console.log('featureFlags::', featureFlags);

      return (
        featureFlags?.[featureFlagKey] &&
        (featureFlags[featureFlagKey] as FeatureFlagValue) ===
          FeatureFlagValue.ENABLED
      );
    });

    return isFeatureEnabled;
  }
}
