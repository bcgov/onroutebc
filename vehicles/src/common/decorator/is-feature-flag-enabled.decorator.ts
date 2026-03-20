import { Reflector } from '@nestjs/core';

/**
 * Decorator to check if a specific feature flag is enabled.
 *
 * The feature flag can be used to conditionally enable or disable parts of the application
 * depending on the current configuration or environment setup.
 *
 * Usage:
 *
 * ```typescript
 * @IsFeatureFlagEnabled('featureName')
 * async someFunction() {
 *   // function implementation
 * }
 * ```
 *
 * @param {string} flagName - The name of the feature flag to check.
 * @returns {MethodDecorator} The method decorator to be applied.
 */

export const IsFeatureFlagEnabled = Reflector.createDecorator<string>();
