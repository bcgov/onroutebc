import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { CacheKey } from '../enum/cache-key.enum';
import { getMapFromCache } from '../helper/cache.helper';
import { IsFeatureFlagEnabled } from './is-feature-enabled.decorator';
import { FeatureFlagValue } from '../enum/feature-flag-value.enum';

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
    console.log('featureFlagKey::', featureFlagKey);
    const isFeatureEnabled = getMapFromCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
    ).then((featureFlags: Record<string, string>) => {
      console.log('featureFlags::', featureFlags);

      return (
        featureFlags &&
        featureFlags[featureFlagKey] === FeatureFlagValue.ENABLED
      );
    });

    return isFeatureEnabled;
  }
}
