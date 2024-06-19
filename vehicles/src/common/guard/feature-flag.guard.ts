import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { IsFeatureFlagEnabled } from '../decorator/is-feature-flag-enabled.decorator';
import { CacheKey } from '../enum/cache-key.enum';
import { FeatureFlagValue } from '../enum/feature-flag-value.enum';
import { getMapFromCache } from '../helper/cache.helper';

/**
 * @class FeatureFlagGuard
 * @description A guard that checks if a specific feature flag is enabled before allowing access to a route.
 * @implements {CanActivate}
 *
 * @constructor
 * @param {Reflector} reflector - A utility for accessing decorated metadata on classes and methods.
 * @param {Cache} cacheManager - A cache manager instance for retrieving feature flag values.
 *
 * @method canActivate
 * @description Determines if the current request can proceed based on the feature flag status.
 * @param {ExecutionContext} context - The context of the current execution (e.g., request).
 * @returns {Promise<boolean>} - A promise that resolves to true if the feature flag is enabled, otherwise false.
 */
@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Determines if the current request can proceed based on the feature flag status.
   *
   * @method canActivate
   * @param {ExecutionContext} context - The context of the current execution (e.g., request).
   * @returns {Promise<boolean>} - A promise that resolves to true if the feature flag is enabled, otherwise false.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const featureFlagKey = this.reflector.getAllAndOverride<string>(
      IsFeatureFlagEnabled,
      [context.getHandler(), context.getClass()],
    );
    // Guard is invoked regardless of the decorator being actively called
    if (!featureFlagKey) return Promise.resolve(true);
    const featureFlags = await getMapFromCache(
      this.cacheManager,
      CacheKey.FEATURE_FLAG_TYPE,
    );
    const isFeatureEnabled =
      featureFlags?.[featureFlagKey] &&
      (featureFlags[featureFlagKey] as FeatureFlagValue) ===
        FeatureFlagValue.ENABLED;
    return isFeatureEnabled;
  }
}
